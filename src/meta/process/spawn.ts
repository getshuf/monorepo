import type { MetaDefinition } from "../types.js";
import { paint, color } from "../../bin/colors.js";

export const metadata: MetaDefinition = {
  type: "process",
  key: "spawn",
  default: false,
  showOnCLI: true,
  description: "Allow the runtime to spawn new child processes",
  action: (store) => {
    if (store?.process?.spawn) {
      console.log(paint(color.yellow, "⚠ Security Warning: Process spawning is enabled"));
    }
  }
};
