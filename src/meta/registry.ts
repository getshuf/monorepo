import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import type { MetaDefinition } from "./types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Loads metadata definitions from dist/meta/<type>/*.js
 * Also supports future external providers.
 */
export async function loadMetaRegistry(): Promise<MetaDefinition[]> {
  const list: MetaDefinition[] = [];
  const metaRoot = path.resolve(__dirname, "../../dist/meta");

  if (!fs.existsSync(metaRoot)) return list;

  const types = fs.readdirSync(metaRoot, { withFileTypes: true })
    .filter(d => d.isDirectory());

  for (const typeDir of types) {
    const typePath = path.join(metaRoot, typeDir.name);
    const files = fs.readdirSync(typePath).filter(f => f.endsWith(".js"));

    for (const f of files) {
      const mod = await import(path.join(typePath, f));
      if (mod.metadata) list.push(mod.metadata);
    }
  }

  return list;
}
