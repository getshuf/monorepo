#!/usr/bin/env node
import { Command } from "commander";
import path from "path";
import { fileURLToPath } from "url";
import { loadCommands } from "./loader.js";
import { LocalPermissionResolver } from "./permissions-local.js";
import { color, paint } from "./colors.js";
import pkg from "../../package.json" assert { type: "json" };
const { version } = pkg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const program = new Command();
program
    .name("shuffle")
    .description(paint(color.magenta, "Shuffle CLI"))
    .version(version);
program.addHelpText("beforeAll", paint(color.blue, "\n❯ Shuffle Runtime CLI\n") +
    paint(color.gray, "Filesystem-driven command system\n\n"));
const commandsDir = path.join(__dirname, "commands");
await loadCommands(program, commandsDir, LocalPermissionResolver);
program.parse(process.argv);
if (!process.argv.slice(2).length) {
    program.outputHelp();
}
//# sourceMappingURL=index.js.map