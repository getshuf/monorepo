import { paint, color } from "../../bin/colors.js";
export const metadata = {
    type: "system",
    key: "info",
    default: true,
    showOnCLI: true,
    description: "Allow the CLI to display system information",
    action: (store) => {
        if (store?.system?.info === false) {
            console.log(paint(color.gray, "• System info display disabled"));
        }
    }
};
//# sourceMappingURL=info.js.map