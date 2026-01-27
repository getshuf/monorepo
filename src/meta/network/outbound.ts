import type { MetaDefinition } from "../types.js";
import { paint, color } from "../../bin/colors.js";

export const metadata: MetaDefinition = {
  type: "network",
  key: "outbound",
  default: false,
  showOnCLI: true,
  description: "Allow the runtime to make outgoing network requests",
  action: (store) => {
    const enabled = store?.network?.outbound;
    if (enabled) {
      console.log(paint(color.cyan, "ℹ Outbound networking enabled"));
    }
  }
};
