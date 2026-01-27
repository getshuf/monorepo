import type { MetaDefinition } from "../types.js";
import { paint, color } from "../../bin/colors.js";
import path from "path";

export const metadata: MetaDefinition = {
  type: "process",
  key: "spawn",
  default: false,
  showOnCLI: true,
  description: "Allow the runtime to spawn new child processes",
  action: (store) => {
    const enabled = store?.process?.spawn;
    const allowedBinaries = store?.process?.allowedBinaries || [];
    const workingDir = store?.process?.cwd || process.cwd();

    if (enabled) {
      console.log(paint(color.yellow, "⚠ Security Warning: Process spawning is enabled"));
      
      if (allowedBinaries.length > 0) {
        console.log(paint(color.gray, `• Permitted binaries: ${allowedBinaries.join(", ")}`));
      } else {
        console.log(paint(color.red, "✖ Critical: No binary whitelist defined. All executable paths accessible."));
      }

      console.log(paint(color.gray, `• Execution context: ${path.resolve(workingDir)}`));
    }
  }
};
