import fs from "fs";
import os from "os";
import path from "path";

// current+/meta.json
const SHUFFLE_DIR = path.join(process.cwd(), ".shuffle");
const META_FILE = path.join(SHUFFLE_DIR, "meta.json");

/**
 * Ensures the configuration directory exists
 */
function ensureDir() {
  if (!fs.existsSync(SHUFFLE_DIR)) {
    fs.mkdirSync(SHUFFLE_DIR, { recursive: true });
  }
}

/**
 * Loads the user meta store (returns {} if missing)
 */
export function loadUserMeta(): any {
  if (!fs.existsSync(META_FILE)) return {};
  try {
    return JSON.parse(fs.readFileSync(META_FILE, "utf8"));
  } catch {
    return {};
  }
}

/**
 * Persist the meta store to disk
 */
export function saveUserMeta(store: any) {
  ensureDir();
  fs.writeFileSync(META_FILE, JSON.stringify(store, null, 2));
}

/**
 * Read a value at type/keyPath with fallback default
 */
export function getMetaValue(store: any, type: string, keyPath: string, def: any): any {
  const parts = keyPath.split(".");
  let cur = store?.[type];
  for (const p of parts) {
    if (cur == null || typeof cur !== "object" || !(p in cur)) return def;
    cur = cur[p];
  }
  return cur;
}

/**
 * Set a value at type/keyPath, creating intermediate objects as needed
 */
export function setMetaValue(store: any, type: string, keyPath: string, value: any): void {
  const parts = keyPath.split(".");
  store[type] ??= {};
  let cur = store[type];

  for (let i = 0; i < parts.length - 1; i++) {
    const k = parts[i];
    if (k === undefined) continue;
    if (cur[k] == null || typeof cur[k] !== "object") {
      cur[k] = {};
    }
    cur = cur[k];
  }

  const lastKey = parts[parts.length - 1];
  if (lastKey !== undefined) {
    cur[lastKey] = value;
  }
}
