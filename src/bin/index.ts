#!/usr/bin/env node
/**
 * Shuffle CLI
 * Control your Shuffle homeserver from the command line
 */
import { Command } from "commander";
import path from "path";
import { fileURLToPath } from "url";

import { loadCommands } from "./loader.js";
import { LocalPermissionResolver } from "./permissions-local.js";
import { color, paint } from "./colors.js";
import { showCLIMetadata } from "../meta/cli-display.js";

import pkg from "../../package.json" with { type: "json" };
const { version } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const program = new Command();

program
  .name("shuffle")
  .description(paint(color.magenta, "Shuffle CLI"))
  .version(version);

program.configureHelp({
  sortSubcommands: true,
  subcommandTerm: (cmd) => paint(color.cyan, cmd.name()),
  commandUsage: (cmd) => paint(color.yellow, cmd.usage()),
  commandDescription: (cmd) => paint(color.gray, cmd.description()),
});

program.addHelpText(
  "beforeAll",
  `
${paint(color.blue, "❯ Shuffle Runtime")} ${paint(color.dim, `v${version}`)}
${paint(color.gray, "The official Shuffle! monorepo CLI")}
`
);

program.addHelpText(
  "afterAll",
  `
${paint(color.cyan, "Documentation:")}
  See https://github.com/getshuf/monorepo for more information.

${paint(color.gray, "🔥 Powered by Shuffle")}
`
);

const commandsDir = path.join(__dirname, "commands");
await loadCommands(program, commandsDir, LocalPermissionResolver);

if (!process.argv.slice(2).length) {
  await showCLIMetadata();
  program.outputHelp();
} else {
  program.parse(process.argv);
}
