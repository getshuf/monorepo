/**
 * Loads the user meta store (returns {} if missing)
 */
export declare function loadUserMeta(): any;
/**
 * Persist the meta store to disk
 */
export declare function saveUserMeta(store: any): void;
/**
 * Read a value at type/keyPath with fallback default
 */
export declare function getMetaValue(store: any, type: string, keyPath: string, def: any): any;
/**
 * Set a value at type/keyPath, creating intermediate objects as needed
 */
export declare function setMetaValue(store: any, type: string, keyPath: string, value: any): void;
//# sourceMappingURL=store.d.ts.map