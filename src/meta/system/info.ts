import type { MetaDefinition } from "../../meta/types.js";
import { paint, color } from "../../bin/colors.js";
import os from "os";

export const metadata: MetaDefinition = {
  type: "system",
  key: "info",
  default: true,
  showOnCLI: true,
  description: "Allow the CLI to display system information",
  action: (store) => {
    const enabled = store?.system?.info !== false;
    const verbose = store?.system?.verbose === true;

    if (!enabled) {
      console.log(paint(color.gray, "• System info display disabled"));
      return;
    }

    if (verbose) {
      const cpuCount = os.cpus().length;
      const totalMem = (os.totalmem() / (1024 * 1024 * 1024)).toFixed(2);
      const freeMem = (os.freemem() / (1024 * 1024 * 1024)).toFixed(2);
      const uptime = (os.uptime() / 3600).toFixed(1);

      console.log(paint(color.cyan, "\n--- System Diagnostics ---"));
      console.log(paint(color.gray, `• Platform: ${os.platform()} (${os.arch()})`));
      console.log(paint(color.gray, `• CPU Cores: ${cpuCount}`));
      console.log(paint(color.gray, `• Memory: ${freeMem}GB free of ${totalMem}GB`));
      console.log(paint(color.gray, `• Uptime: ${uptime} hours`));
      console.log("");
    }
  }
};
