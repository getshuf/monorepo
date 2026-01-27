import { paint, color } from "../../bin/colors.js";
export const metadata = {
    type: "network",
    key: "outbound",
    default: false,
    showOnCLI: true,
    description: "Allow the runtime to make outgoing network requests",
    action: (store) => {
        const enabled = store?.network?.outbound;
        const allowedDomains = store?.network?.allowedDomains || [];
        const proxy = store?.network?.proxy;
        if (enabled) {
            console.log(paint(color.cyan, "ℹ Outbound networking enabled"));
            if (allowedDomains.length > 0) {
                console.log(paint(color.gray, `• Whitelisted domains: ${allowedDomains.join(", ")}`));
            }
            else {
                console.log(paint(color.yellow, "⚠ Warning: No domain restrictions configured. All outbound traffic permitted."));
            }
            if (proxy) {
                console.log(paint(color.gray, `• Using network proxy: ${proxy}`));
            }
        }
    }
};
//# sourceMappingURL=outbound.js.map