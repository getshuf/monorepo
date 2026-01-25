import type { CommandDefinition } from "../../loader.js";
import { parseJSONValue } from "../../../meta/parser.js";
import {
  loadUserMeta,
  saveUserMeta,
  setMetaValue,
} from "../../../meta/store.js";
import { color, paint } from "../../colors.js";

export const command: CommandDefinition = {
  name: "set <key> <value>",
  description: "Set a metadata value",

  options: [
    { flags: "-v, --verbose", description: "Verbose output", default: false },
  ],

  async action(key: string, value: string, options: { verbose: boolean }) {
    const [type, ...rest] = key.split(".");
    if (!type || rest.length === 0) {
      console.error(paint(color.red, "✖ Invalid key format"));
      process.exit(1);
    }

    const parsed = parseJSONValue(value);
    const store = loadUserMeta();
    setMetaValue(store, type, rest.join("."), parsed);
    saveUserMeta(store);

    if (options.verbose) {
      console.log(paint(color.gray, "Stored:"), parsed);
    }

    console.log(paint(color.green, "✔ Metadata updated"));
  },
};
