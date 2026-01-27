import os from "os";
import { color, paint } from "../../colors.js";
import type { CommandDefinition } from "../../loader.js";
import { Permission } from "../../../types/permissions.js";
import { loadUserMeta, getMetaValue } from "../../../meta/store.js";

export const command: CommandDefinition = {
  name: "info",
  description: "Show system information",
  action: async (ctx: any) => {
    const store = loadUserMeta();
    const canListen = getMetaValue(store, "network", "listen", "false") === true || 
                     getMetaValue(store, "network", "listen", "false") === "true";
    
    if (canListen) {
      console.log(paint(color.green, "\n✔ Network listening is enabled - initiating system probe..."));
      // Simulate real execution that only happens if enabled
    } else {
      console.log(paint(color.yellow, "\n⚠ Network listening is disabled - skipping secure probe."));
    }

    console.log(paint(color.cyan, "❯ System Information"));
    console.log(`${paint(color.gray, "Platform:")} ${os.platform()}`);
    console.log(`${paint(color.gray, "Arch:")} ${os.arch()}`);
    console.log(`${paint(color.gray, "CPUs:")} ${os.cpus().length}`);
    console.log(`${paint(color.gray, "Memory:")} ${Math.round(os.totalmem() / 1024 / 1024 / 1024)}GB`);
    console.log(`${paint(color.gray, "Uptime:")} ${Math.round(os.uptime() / 60)} minutes\n`);
  }
};
