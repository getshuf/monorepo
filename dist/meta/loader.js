/**
 * Loads meta type definitions from dist/meta/<type>/*.js
 * Allows 3rd party packages to provide meta schemas
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
/**
 * Loads meta type definitions from:
 *  - Built-in dist/meta/*
 *  - External paths listed in ~/.shuffle.json under "meta.paths"
 */
export async function loadMetaTypes() {
    const map = new Map();
    const metaRoot = path.resolve(__dirname, "../../dist/meta");
    if (!fs.existsSync(metaRoot))
        return map;
    const types = fs
        .readdirSync(metaRoot, { withFileTypes: true })
        .filter((d) => d.isDirectory());
    for (const typeDir of types) {
        const type = typeDir.name;
        const entry = path.join(metaRoot, type, "index.js");
        if (!fs.existsSync(entry))
            continue;
        const mod = await import(entry);
        if (mod.metaType) {
            map.set(type, mod.metaType);
        }
    }
    return map;
}
//# sourceMappingURL=loader.js.map