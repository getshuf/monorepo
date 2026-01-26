import { loadMetaModules } from "./registry.js";
import { loadUserMeta, getMetaValue } from "./store.js";

export async function showCLIMetadata() {
  const modules = await loadMetaModules();
  const store = loadUserMeta();

  for (const entry of modules) {
    const meta = entry.meta;

    if (!meta.showOnCLI) continue;

    const enabled = getMetaValue(store, meta.type, meta.key, meta.default);
    if (enabled === false || enabled === "false") continue;

    /* Display logic per metadata unit */
    if (meta.type === "cli" && meta.key === "help.tips") {
      const tips: string[] = entry.module.tips;
      if (!tips?.length) continue;

      const tip = tips[Math.floor(Math.random() * tips.length)];
      console.log("\n\x1b[90mTip:\x1b[0m", tip, "\n");
    }
  }
}
