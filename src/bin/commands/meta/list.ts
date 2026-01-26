import { loadUserMeta } from "../../../meta/store.js";
import type { CommandDefinition } from "../../loader.js";
import { color, paint } from "../../colors.js";

export const command: CommandDefinition = {
  name: "list",
  description: "List all categories and keys in the meta store",
  action: () => {
    const store = loadUserMeta();
    const categories = Object.keys(store);
    
    if (categories.length === 0) {
      console.log(paint(color.yellow, "Meta store is empty."));
      return;
    }

    console.log(paint(color.cyan, "\n❯ Meta Store Content"));
    for (const cat of categories) {
      const keys = Object.keys(store[cat] || {});
      console.log(`${paint(color.bold, cat)}: ${keys.join(", ") || "(empty)"}`);
    }
  },
};
