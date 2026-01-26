import { loadUserMeta } from "../../../meta/store.js";
import { loadMetaModules } from "../../../meta/registry.js";
import { color, paint } from "../../colors.js";
export const command = {
    name: "list",
    description: "List all categories and keys in the meta store",
    action: async () => {
        const store = loadUserMeta();
        const metaModules = await loadMetaModules();
        const visibleMeta = metaModules
            .filter(m => m.meta.showOnCLI)
            .map(m => m.meta);
        console.log(paint(color.cyan, "\n❯ Available Metadata (Definitions)"));
        if (visibleMeta.length === 0) {
            console.log(paint(color.gray, " No public metadata definitions found."));
        }
        else {
            for (const meta of visibleMeta) {
                console.log(`${paint(color.bold, `${meta.type}.${meta.key}`)}: ${meta.description || "No description"}`);
            }
        }
        const categories = Object.keys(store);
        console.log(paint(color.cyan, "\n❯ Current Meta Store Values"));
        if (categories.length === 0) {
            console.log(paint(color.yellow, " Meta store is empty."));
        }
        else {
            for (const cat of categories) {
                const keys = Object.keys(store[cat] || {});
                console.log(`${paint(color.bold, cat)}: ${keys.join(", ") || "(empty)"}`);
            }
        }
    },
};
//# sourceMappingURL=list.js.map