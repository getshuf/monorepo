import type { MetaDefinition } from "../types.js";
import { paint, color } from "../../bin/colors.js";

export const metadata: MetaDefinition = {
  type: "network",
  key: "inbound",
  default: false,
  showOnCLI: true,
  description: "Allow the runtime to accept incoming network connections",
  action: (store) => {
    if (store?.network?.inbound) {
      console.log(paint(color.yellow, "⚠ Security Warning: Inbound networking is enabled"));
    }
  }
};
