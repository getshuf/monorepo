import type { MetaDefinition } from "../types.js";
import { paint, color } from "../../bin/colors.js";

export const metadata: MetaDefinition = {
  type: "process",
  key: "signal",
  default: false,
  showOnCLI: true,
  description: "Allow the runtime to send signals (like SIGTERM) to processes",
  action: (store) => {
    if (store?.process?.signal) {
      console.log(paint(color.cyan, "ℹ Process signaling enabled"));
    }
  }
};
