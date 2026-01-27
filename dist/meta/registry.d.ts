import type { MetaDefinition } from "./types.js";
/**
 * Load all meta modules as pairs of { metadata, module }.
 * Each module is expected to `export const metadata = { ... }` and optionally additional exports
 * (e.g. tips, message, etc.). The loader returns both descriptor + the module so the CLI can act on it.
 */
export declare function loadMetaModules(forceReload?: boolean): Promise<{
    meta: MetaDefinition;
    module: any;
}[]>;
/**
 * Clear the module cache
 */
export declare function clearMetaCache(): void;
//# sourceMappingURL=registry.d.ts.map