import fs from "fs";
import os from "os";
import path from "path";
const META_FILE = path.join(os.homedir(), ".shuffle.json");
/**
 * Loads the user meta store (returns {} if missing)
 */
export function loadUserMeta() {
    if (!fs.existsSync(META_FILE))
        return {};
    try {
        return JSON.parse(fs.readFileSync(META_FILE, "utf8"));
    }
    catch {
        return {};
    }
}
/**
 * Persist the meta store to disk
 */
export function saveUserMeta(store) {
    fs.writeFileSync(META_FILE, JSON.stringify(store, null, 2));
}
/**
 * Read a value at type/keyPath with fallback default
 */
export function getMetaValue(store, type, keyPath, def) {
    const parts = keyPath.split(".");
    let cur = store?.[type];
    for (const p of parts) {
        if (cur == null || typeof cur !== "object" || !(p in cur))
            return def;
        cur = cur[p];
    }
    return cur;
}
/**
 * Set a value at type/keyPath, creating intermediate objects as needed
 */
export function setMetaValue(store, type, keyPath, value) {
    const parts = keyPath.split(".");
    store[type] ??= {};
    let cur = store[type];
    for (let i = 0; i < parts.length - 1; i++) {
        const k = parts[i];
        if (k === undefined)
            continue;
        cur[k] ??= {};
        cur = cur[k];
    }
    const lastKey = parts[parts.length - 1];
    if (lastKey !== undefined) {
        cur[lastKey] = value;
    }
}
//# sourceMappingURL=store.js.map