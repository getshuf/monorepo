import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import type { MetaDefinition } from "./types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Load all meta modules as pairs of { metadata, module }.
 * Each module is expected to `export const metadata = { ... }` and optionally additional exports
 * (e.g. tips, message, etc.). The loader returns both descriptor + the module so the CLI can act on it.
 */
export async function loadMetaModules(): Promise<
  { meta: MetaDefinition; module: any }[]
> {
  const result: { meta: MetaDefinition; module: any }[] = [];
  const metaRoot = path.resolve(__dirname, "../../dist/meta");

  if (!fs.existsSync(metaRoot)) return result;

  const typeDirs = fs.readdirSync(metaRoot, { withFileTypes: true })
    .filter(d => d.isDirectory());

  for (const dir of typeDirs) {
    const folder = path.join(metaRoot, dir.name);
    const files = fs.readdirSync(folder).filter(f => f.endsWith(".js"));

    for (const f of files) {
      const full = path.join(folder, f);
      try {
        const mod = await import(full);
        if (mod?.metadata) {
          result.push({ meta: mod.metadata, module: mod });
        }
      } catch (err) {
        // swallow individual module load errors but log them
        console.warn(`Failed loading meta module ${full}:`, (err as any)?.message || err);
      }
    }
  }

  return result;
}
