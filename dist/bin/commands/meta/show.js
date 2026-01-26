import { loadUserMeta } from "../../../meta/store.js";
import { color, paint } from "../../colors.js";
export const command = {
    name: "show <keyPath>",
    description: "Show metadata value or tips for a key path",
    action: (keyPath) => {
        const store = loadUserMeta();
        const parts = keyPath.split(".");
        const type = parts[0];
        const path = parts.slice(1).join(".");
        let value = store[type];
        if (path) {
            const subParts = path.split(".");
            for (const p of subParts) {
                if (value && typeof value === "object") {
                    value = value[p];
                }
                else {
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
//# sourceMappingURL=show.js.map