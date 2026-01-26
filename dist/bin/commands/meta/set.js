import { loadUserMeta, saveUserMeta, setMetaValue } from "../../../meta/store.js";
export const command = {
    name: "set <type> <key> <value>",
    description: "Set a configuration value in the user meta store",
    action: (type, key, value) => {
        const store = loadUserMeta();
        setMetaValue(store, type, key, value);
        saveUserMeta(store);
        console.log(`Successfully set ${type}.${key} to "${value}" in ~/.shuffle.json`);
    },
};
//# sourceMappingURL=set.js.map