import type { MetaDefinition } from "../types.js";
import { paint, color } from "../../bin/colors.js";

export const metadata: MetaDefinition = {
  type: "cli",
  key: "help.tips",
  default: true,
  showOnCLI: true,
  description: "Show random CLI tips on startup",
  action: (store) => {
    if (store?.cli?.["help.tips"] === false) {
      console.log(paint(color.gray, "• CLI tips are hidden"));
    }
  }
};

/* The actual content owned by this metadata unit */
export const tips = [
  "Use `--help` on any command to reveal its secrets.",
  "Verbose mode is truth serum for software.",
  "Your CLI remembers what you teach it.",
  "Dark mode reduces bugs. Probably.",
  "Every command is a tiny spell. Type responsibly."
];
