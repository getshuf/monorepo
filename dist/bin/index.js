#!/usr/bin/env node
import { Command } from "commander";
import path from "path";
import { loadCommands } from "./loader.js";
import { color, paint } from "./colors.js";
import { tips } from "../meta/tips.js";
const program = new Command();
program
    .name("shuffle")
    .description(paint(color.magenta, "Shuffle Runtime CLI"))
    .version("1.0.0")
    .configureHelp({
    sortSubcommands: true,
    sortOptions: true,
});
const randomTip = tips[Math.floor(Math.random() * tips.length)] ??
    "Run `shuffle --help` to explore available commands.";
program.addHelpText("beforeAll", () => paint(color.blue, "\n❯ Shuffle Runtime\n") +
    paint(color.gray, "  Open-source runtime for Shuffle\n") +
    "\n" +
    paint(color.gray, randomTip));
const commandsDir = path.join(__dirname, "commands");
await loadCommands(program, commandsDir);
program.parse(process.argv);
if (!process.argv.slice(2).length) {
    program.outputHelp();
}
//# sourceMappingURL=index.js.map