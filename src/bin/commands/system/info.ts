import os from "os";
import { color, paint } from "../../colors.js";
import type { CommandDefinition } from "../../loader.js";
import { Permission } from "../../../types/permissions.js";

export const command: CommandDefinition = {
  name: "info",
  description: "Show system information",
  permissions: [Permission.DevInspect],
  action: () => {
    console.log(paint(color.cyan, "\n❯ System Information"));
    console.log(`${paint(color.gray, "Platform:")} ${os.platform()}`);
    console.log(`${paint(color.gray, "Arch:")} ${os.arch()}`);
    console.log(`${paint(color.gray, "CPUs:")} ${os.cpus().length}`);
    console.log(`${paint(color.gray, "Memory:")} ${Math.round(os.totalmem() / 1024 / 1024 / 1024)}GB`);
    console.log(`${paint(color.gray, "Uptime:")} ${Math.round(os.uptime() / 60)} minutes\n`);
  }
};
