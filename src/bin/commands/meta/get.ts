import { loadUserMeta } from "../../../meta/store.js";
import type { CommandDefinition } from "../../loader.js";
import { color, paint } from "../../colors.js";

export const command: CommandDefinition = {
  name: "get <type> <key>",
  description: "Get a configuration value from the user meta store",
  action: (type: string, key: string) => {
    const store = loadUserMeta();
    const value = store?.[type]?.[key];
    
    if (value === undefined) {
      console.log(`${paint(color.yellow, "⚠")} No value found for ${paint(color.cyan, `${type}.${key}`)}`);
    } else {
      console.log(`${paint(color.cyan, `${type}.${key}`)}: ${paint(color.white, JSON.stringify(value, null, 2))}`);
    }
  },
};
