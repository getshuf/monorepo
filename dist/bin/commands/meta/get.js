import { loadUserMeta } from "../../../meta/store.js";
import { color, paint } from "../../colors.js";
export const command = {
    name: "get <type> <key>",
    description: "Get a configuration value from the user meta store",
    action: (type, key) => {
        const store = loadUserMeta();
        const value = store?.[type]?.[key];
        if (value === undefined) {
            console.log(`${paint(color.yellow, "⚠")} No value found for ${paint(color.cyan, `${type}.${key}`)}`);
        }
        else {
            console.log(`${paint(color.cyan, `${type}.${key}`)}: ${paint(color.bold, JSON.stringify(value, null, 2))}`);
        }
    },
};
//# sourceMappingURL=get.js.map