import { loadUserMeta } from "../../../meta/store.js";
import type { CommandDefinition } from "../../loader.js";
import { color, paint } from "../../colors.js";

export const command: CommandDefinition = {
  name: "show <keyPath>",
  description: "Show metadata value or tips for a key path",
  action: (keyPath: string) => {
    const store = loadUserMeta();
    const parts = keyPath.split(".");
    const type = parts[0] as string;
    const path = parts.slice(1).join(".");
    
    let value = (store as Record<string, any>)[type];
    if (path) {
      const subParts = path.split(".");
      for (const p of subParts) {
        if (value && typeof value === "object") {
          value = value[p];
        } else {
          value = undefined;
          break;
        }
      }
    }

    if (value === undefined) {
      console.log(paint(color.yellow, `No metadata found for ${keyPath}`));
      return;
    }

    console.log(paint(color.cyan, `\n❯ ${keyPath}`));
    console.log(JSON.stringify(value, null, 2));

    // Simple tip logic
    if (keyPath === "cli.help.tips") {
      console.log(paint(color.gray, "\nTip: Set this to true to enable helpful CLI hints."));
    }
  },
};
