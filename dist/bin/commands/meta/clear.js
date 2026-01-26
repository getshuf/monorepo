import { loadUserMeta, saveUserMeta } from "../../../meta/store.js";
import { color, paint } from "../../colors.js";
export const command = {
    name: "clear <type>",
    description: "Clear all configuration values for a specific type",
    action: (type) => {
        const store = loadUserMeta();
        if (store[type]) {
            delete store[type];
            saveUserMeta(store);
            console.log(paint(color.green, `Successfully cleared all "${type}" metadata.`));
        }
        else {
            console.log(paint(color.yellow, `No metadata found for type "${type}".`));
        }
    },
};
//# sourceMappingURL=clear.js.map