import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import { Command } from "commander";
import { color, paint } from "./colors.js";
import { loadUserMeta, getMetaValue } from "../meta/store.js";

import type { Permission, PermissionResolver } from "../types/permissions.js";
import type { CLIContext } from "../types/context.js";

/* -------------------------------------------------- */
/* Command Types                                       */
/* -------------------------------------------------- */

export interface CommandContext {
  category: string;
  name: string;
  options: any;
  args: any[];
  startTime: number;
}

export interface CommandDefinition {
  name: string;
  description?: string;
  aliases?: string[];

  options?: Array<{
    flags: string;
    description?: string;
    default?: any;
  }>;

  examples?: string[];
  hidden?: boolean;
  deprecated?: string;

  permissions?: Permission[];

  before?: (ctx: CommandContext & CLIContext) => Promise<void> | void;
  after?: (ctx: CommandContext & CLIContext) => Promise<void> | void;
  validate?: (ctx: CommandContext & CLIContext) => Promise<void> | void;

  action: (...args: any[]) => any | Promise<any>;
}

/* -------------------------------------------------- */
/* Loader                                              */
/* -------------------------------------------------- */

export async function loadCommands(
  program: Command,
  baseDir: string,
  resolver: PermissionResolver
) {
  const categories = readDirs(baseDir);

  for (const categoryName of categories) {
    const categoryPath = path.join(baseDir, categoryName);

    const categoryCmd = program
      .command(categoryName)
      .description(paint(color.cyan, `${categoryName} commands`));

    const files = readFiles(categoryPath);

    for (const file of files) {
      if (shouldSkipFile(file)) continue;

      const fullPath = path.join(categoryPath, file);

      try {
        const mod = await import(pathToFileURL(fullPath).href);

        if (!mod.command) {
          warn(`Skipped ${file} (no export "command")`);
          continue;
        }

        registerCommand(categoryCmd, categoryName, mod.command, resolver);
      } catch (err: any) {
        error(`Failed loading ${file}`, err?.message || err);
      }
    }
  }
}

/* -------------------------------------------------- */
/* Registration                                        */
/* -------------------------------------------------- */

function registerCommand(
  categoryCmd: Command,
  categoryName: string,
  def: CommandDefinition,
  resolver: PermissionResolver
) {
  let cmd = categoryCmd.command(def.name);

  if (def.description) cmd.description(def.description);
  if (def.hidden) (cmd as any).hidden();

  if (def.aliases) for (const a of def.aliases) cmd.alias(a);

  if (def.options) {
    for (const opt of def.options) {
      cmd.option(opt.flags, opt.description, opt.default);
    }
  }

  if (def.examples?.length) {
    cmd.addHelpText(
      "after",
      "\nExamples:\n" +
        def.examples.map(e => `  $ ${e}`).join("\n") +
        "\n"
    );
  }

  if (def.deprecated) {
    cmd.addHelpText(
      "before",
      paint(color.yellow, `⚠ Deprecated: ${def.deprecated}\n\n`)
    );
  }

  cmd.action(async (...args: any[]) => {
    const options = args.at(-1);
    const pureArgs = args.slice(0, -1);

    const ctx: CommandContext & CLIContext = {
      category: categoryName,
      name: def.name,
      options,
      args: pureArgs,
      startTime: Date.now(),
      permissions: resolver
    };

    try {
      if (def.permissions) checkPermissions(resolver, def.permissions);
      
      // Real-time metadata check for security
      // Skip blocking for administrative commands like "meta"
      if (categoryName !== "meta") {
        const store = loadUserMeta();
        const rawValue = getMetaValue(store, categoryName, def.name, true);
        const isBlocked = rawValue === false || rawValue === "false";
        
        if (isBlocked) {
          throw new Error(`Command "${categoryName}.${def.name}" is disabled in security settings.`);
        }
      }

      if (def.before) await def.before(ctx);
      if (def.validate) await def.validate(ctx);

      await def.action(...args);

      if (def.after) await def.after(ctx);

      showTiming(ctx);
    } catch (err: any) {
      error("Command failed", err?.message || err);
      process.exit(1);
    }
  });
}

/* -------------------------------------------------- */
/* Permission Check                                    */
/* -------------------------------------------------- */

function checkPermissions(resolver: PermissionResolver, perms: Permission[]) {
  for (const perm of perms) {
    if (!resolver.has(perm)) {
      throw new Error(`Missing permission: ${perm}`);
    }
  }
}

/* -------------------------------------------------- */
/* Filesystem Helpers                                  */
/* -------------------------------------------------- */

function shouldSkipFile(file: string) {
  return (
    file.endsWith(".d.ts") ||
    file.endsWith(".map") ||
    file.startsWith("_")
  );
}

function readDirs(dir: string): string[] {
  try {
    return fs.readdirSync(dir, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name);
  } catch {
    return [];
  }
}

function readFiles(dir: string): string[] {
  try {
    return fs.readdirSync(dir)
      .filter(f => /\.(ts|js|mjs|cjs)$/.test(f));
  } catch {
    return [];
  }
}

/* -------------------------------------------------- */
/* Diagnostics                                         */
/* -------------------------------------------------- */

function showTiming(ctx: CommandContext) {
  const ms = Date.now() - ctx.startTime;
  console.log(paint(color.gray, `• Completed in ${ms}ms`));
}

function warn(msg: string) {
  console.warn(paint(color.yellow, `⚠ ${msg}`));
}

function error(title: string, msg: string) {
  console.error(paint(color.red, `✖ ${title}: ${msg}`));
}
