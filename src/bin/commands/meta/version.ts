import type { CommandDefinition } from "../../loader.js";
import { color, paint } from "../../colors.js";
import ora from "ora";
import fs from "node:fs";
import path from "node:path";

import rawPkg from "../../../../package.json" with { type: "json" };

/* ---------------- Package.json Type ---------------- */

type PackageJson = {
  name: string;
  version: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  optionalDependencies?: Record<string, string>;
};

const pkg = rawPkg as PackageJson;

/* ---------------- Remote API Types ---------------- */

type GithubCommit = { sha: string };
type GithubRelease = { tag_name?: string };
type NpmRegistry = { "dist-tags"?: { latest?: string } };

/* ---------------- Utility Detectors ---------------- */

function isWorkspace(version: string) {
  return (
    version.startsWith("workspace:") ||
    version.startsWith("file:") ||
    version.startsWith("link:")
  );
}

function isGithubShorthand(version: string) {
  return version.startsWith("github:");
}

function isGitUrl(version: string) {
  return version.startsWith("git+");
}

function extractGithubRepo(version: string, name: string): string | null {
  if (isGithubShorthand(version)) return version.replace("github:", "");
  if (isGitUrl(version)) {
    const match = version.match(/github\.com\/(.+?)(\.git)?$/);
    return match?.[1] ?? null;
  }
  if (name.includes("/")) return name;
  return null;
}

/* ---------------- Remote Fetchers ---------------- */

async function fetchNpmLatest(name: string): Promise<string | null> {
  const spinner = ora(`npm → ${name}`).start();
  try {
    const res = await fetch(`https://registry.npmjs.org/${name}`);
    if (!res.ok) {
      spinner.stop();
      return null;
    }
    const data = (await res.json()) as NpmRegistry;
    const latest = data["dist-tags"]?.latest;
    if (latest) spinner.succeed(`latest ${latest}`);
    else spinner.stop();
    return latest ?? null;
  } catch {
    spinner.stop();
    return null;
  }
}

async function fetchGithubInfo(repo: string): Promise<string | null> {
  const spinner = ora(`GitHub → ${repo}`).start();
  try {
    const releaseRes = await fetch(
      `https://api.github.com/repos/${repo}/releases/latest`,
    );
    if (releaseRes.ok) {
      const rel = (await releaseRes.json()) as GithubRelease;
      if (rel.tag_name) {
        spinner.succeed(`release ${rel.tag_name}`);
        return rel.tag_name;
      }
    }

    const commitRes = await fetch(
      `https://api.github.com/repos/${repo}/commits`,
    );
    if (commitRes.ok) {
      const commits = (await commitRes.json()) as GithubCommit[];
      const sha = commits[0]?.sha?.slice(0, 7);
      if (sha) {
        spinner.succeed(`commit ${sha}`);
        return sha;
      }
    }

    spinner.stop();
    return null;
  } catch {
    spinner.stop();
    return null;
  }
}

async function fetchShuffleCommit(): Promise<string | null> {
  const spinner = ora("Fetching Shuffle! commit…").start();
  try {
    const res = await fetch(
      "https://api.github.com/repos/getshuf/monorepo/commits",
    );
    if (!res.ok) {
      spinner.stop();
      return null;
    }
    const data = (await res.json()) as GithubCommit[];
    const sha = data[0]?.sha?.slice(0, 7);
    if (sha) spinner.succeed(`commit ${sha}`);
    else spinner.stop();
    return sha ?? null;
  } catch {
    spinner.stop();
    return null;
  }
}

/* ---------------- Subdependency Tree ---------------- */

type TreeNode = {
  name: string;
  version: string;
  children: TreeNode[];
};

function readInstalledPackage(
  pkgName: string,
  seen = new Set<string>(),
): TreeNode | null {
  if (seen.has(pkgName)) return null;
  seen.add(pkgName);

  const pkgPath = path.join(
    process.cwd(),
    "node_modules",
    pkgName,
    "package.json",
  );
  if (!fs.existsSync(pkgPath)) return null;

  const data = JSON.parse(fs.readFileSync(pkgPath, "utf8")) as {
    name: string;
    version: string;
    dependencies?: Record<string, string>;
  };

  const children: TreeNode[] = [];

  for (const dep of Object.keys(data.dependencies ?? {})) {
    const child = readInstalledPackage(dep, seen);
    if (child) children.push(child);
  }

  return {
    name: data.name,
    version: data.version,
    children,
  };
}

function printTree(node: TreeNode, prefix = "") {
  console.log(`${prefix}+-- ${node.name} ${paint(color.gray, node.version)}`);
  const next = prefix + "    ";
  for (const child of node.children) {
    printTree(child, next);
  }
}

/* ---------------- Dependency Processor ---------------- */

async function processDependencyRoot(
  name: string,
  version: string,
  badge: string,
) {
  let line = `  ${name} ${paint(color.gray, version)} ${paint(color.gray, badge)}`;

  if (isWorkspace(version)) {
    line += ` ${paint(color.gray, "(local)")}`;
    console.log(line);
    return;
  }

  const repo = extractGithubRepo(version, name);
  if (repo) {
    const gh = await fetchGithubInfo(repo);
    if (gh) line += ` ${paint(color.gray, `(GitHub ${gh})`)}`;
    console.log(line);
  } else {
    const npm = await fetchNpmLatest(name);
    if (npm) line += ` ${paint(color.gray, `(npm ${npm})`)}`;
    console.log(line);
  }

  const tree = readInstalledPackage(name);
  if (tree?.children.length) {
    printTree(tree, "    ");
  }
}

/* ---------------- Command Definition ---------------- */

export const command: CommandDefinition = {
  name: "version",
  description: "Display Shuffle! version and full dependency tree",
  aliases: ["v", "ver", "--version", "-v", "about", "deps", "tree"],

  action: async () => {
    console.log();

    const sha = await fetchShuffleCommit();
    const header =
      `Shuffle! CLI ${pkg.version}` +
      (sha ? ` ${paint(color.gray, `(${sha})`)}` : "");

    console.log(header);
    console.log();

    const groups = [
      { label: "Dependencies", deps: pkg.dependencies, badge: "[save]" },
      { label: "Dev Dependencies", deps: pkg.devDependencies, badge: "[dev]" },
      {
        label: "Peer Dependencies",
        deps: pkg.peerDependencies,
        badge: "[peer]",
      },
      {
        label: "Optional Dependencies",
        deps: pkg.optionalDependencies,
        badge: "[optional]",
      },
    ];

    for (const group of groups) {
      const entries = Object.entries(group.deps ?? {});
      if (!entries.length) continue;

      console.log(`${group.label} ${paint(color.gray, group.badge)}`);

      for (const [name, version] of entries) {
        await processDependencyRoot(name, version, group.badge);
      }

      console.log();
    }
  },
};
