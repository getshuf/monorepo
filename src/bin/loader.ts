import fs from "fs";
import path from "path";
import { Command } from "commander";
import { color, paint } from "./colors.js";

export async function loadCommands(program: Command, baseDir: string) {
  const categories = fs.readdirSync(baseDir, { withFileTypes: true })
    .filter(d => d.isDirectory());

  for (const category of categories) {
    const categoryName = category.name;
    const categoryPath = path.join(baseDir, categoryName);

    const categoryCmd = program
      .command(categoryName)
      .description(paint(color.cyan, `${categoryName} commands`));

    const files = fs.readdirSync(categoryPath).filter(f => f.endsWith(".ts") || f.endsWith(".js"));

    for (const file of files) {
      const fullPath = path.join(categoryPath, file);
      const mod = await import(fullPath);

      if (!mod.command) {
        console.warn(paint(color.yellow, `⚠ Skipped ${file} (no export "command")`));
        continue;
      }

      registerCommand(categoryCmd, mod.command);
    }
  }
}

function registerCommand(categoryCmd: Command, def: any) {
  const cmd = categoryCmd.command(def.name).description(def.description || "");

  if (Array.isArray(def.options)) {
    for (const opt of def.options) {
      cmd.option(opt.flags, opt.description, opt.default);
    }
  }

  cmd.action(async (...args: any[]) => {
    try {
      await def.action(...args);
    } catch (err: any) {
      console.error(paint(color.red, "✖ Error:"), err?.message || err);
      process.exit(1);
    }
  });
}
