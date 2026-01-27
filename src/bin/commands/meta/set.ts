import { loadUserMeta, saveUserMeta, setMetaValue } from "../../../meta/store.js";
import type { CommandDefinition } from "../../loader.js";
import { color, paint } from "../../colors.js";

export const command: CommandDefinition = {
  name: "set <type> <key> <value>",
  description: "Set a configuration value in the user meta store",
  action: (type: string, key: string, value: string) => {
    const store = loadUserMeta();
    setMetaValue(store, type, key, value);
    saveUserMeta(store);
    
    console.log(`${paint(color.green, "✔")} Configuration ${paint(color.cyan, `${type}.${key}`)} updated to ${paint(color.white, `"${value}"`)}`);
  },
};
