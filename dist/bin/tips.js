import { tips } from "../meta/tips.js";
import { getMetaValue } from "../meta/store.js";
import { paint, color } from "./colors.js";
export function maybeShowTip() {
    // Check metadata flag default true if not set
    const enabled = getMetaValue("cli.help.tips", true);
    if (!enabled)
        return;
    // Gather tips that are allowed to show on CLI
    const allowed = tips.filter(t => t.showOnCLI);
    if (allowed.length === 0)
        return;
    const selection = allowed[Math.floor(Math.random() * allowed.length)];
    console.log(paint(color.gray, "Tip:"), selection.text);
}
//# sourceMappingURL=tips.js.map