import type { MetaDefinition } from "../types.js";
import { paint, color } from "../../bin/colors.js";

export const metadata: MetaDefinition = {
  type: "process",
  key: "kill",
  default: false,
  showOnCLI: true,
  description: "Allow the runtime to terminate existing processes",
  action: (store) => {
    if (store?.process?.kill) {
      console.log(paint(color.red, "⚠ High Risk: Process termination (kill) is enabled"));
    }
  }
};
