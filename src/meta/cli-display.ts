import { loadMetaModules } from "./registry.js";
import { loadUserMeta, getMetaValue } from "./store.js";
import { paint, color } from "../bin/colors.js";

export async function showCLIMetadata() {
  const modules = await loadMetaModules();
  const store = loadUserMeta();

  for (const entry of modules) {
    const meta = entry.meta;

    if (!meta.showOnCLI) continue;

    const value = getMetaValue(store, meta.type, meta.key, meta.default);
    
    // Skip if disabled (except for tips which are handled specifically)
    if (value === false || value === "false") {
      if (meta.key !== "help.tips") continue;
    }

    /* Display logic per metadata unit */
    
    // Special handling for tips
    if (meta.type === "cli" && meta.key === "help.tips") {
      if (value === false || value === "false") continue;
      
      const tips: string[] = entry.module.tips;
      if (!tips?.length) continue;

      const tip = tips[Math.floor(Math.random() * tips.length)];
      console.log(`\n${paint(color.gray, "Tip:")} ${tip}\n`);
      continue;
    }

    // Generic display for enabled metadata with actions
    if (meta.action && value !== false && value !== "false") {
      try {
        await meta.action(store);
      } catch (err) {
        console.warn(paint(color.yellow, `⚠ Action failed for ${meta.type}.${meta.key}:`), err);
      }
    }
  }
}

/**
 * Prints a summary of all active metadata settings
 */
export async function printMetaSummary() {
  const modules = await loadMetaModules();
  const store = loadUserMeta();
  
  console.log(paint(color.cyan, "\nActive Metadata Configuration:"));
  
  let found = false;
  for (const entry of modules) {
    const meta = entry.meta;
    const value = getMetaValue(store, meta.type, meta.key, null);
    
    if (value !== null && value !== meta.default) {
      console.log(`  ${paint(color.blue, meta.type + "." + meta.key)}: ${value}`);
      found = true;
    }
  }
  
  if (!found) {
    console.log(paint(color.gray, "  (Default settings)"));
  }
  console.log("");
}
