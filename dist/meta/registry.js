import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let cachedModules = null;
/**
 * Load all meta modules as pairs of { metadata, module }.
 * Each module is expected to `export const metadata = { ... }` and optionally additional exports
 * (e.g. tips, message, etc.). The loader returns both descriptor + the module so the CLI can act on it.
 */
export async function loadMetaModules(forceReload = false) {
    if (cachedModules && !forceReload) {
        return cachedModules;
    }
    const result = [];
    const metaRoot = path.resolve(__dirname, "../../dist/meta");
    if (!fs.existsSync(metaRoot))
        return result;
    const typeDirs = fs.readdirSync(metaRoot, { withFileTypes: true })
        .filter(d => d.isDirectory());
    const modulePromises = typeDirs.flatMap(dir => {
        const folder = path.join(metaRoot, dir.name);
        return fs.readdirSync(folder)
            .filter(f => f.endsWith(".js"))
            .map(async (f) => {
            const full = path.join(folder, f);
            try {
                const mod = await import(pathToFileURL(full).href);
                if (mod?.metadata) {
                    return { meta: mod.metadata, module: mod };
                }
            }
            catch (err) {
                console.warn(`Failed loading meta module ${full}:`, err?.message || err);
            }
            return null;
        });
    });
    const loaded = await Promise.all(modulePromises);
    for (const m of loaded) {
        if (m)
            result.push(m);
    }
    cachedModules = result;
    return result;
}
/**
 * Clear the module cache
 */
export function clearMetaCache() {
    cachedModules = null;
}
//# sourceMappingURL=registry.js.map