import { paint, color } from "../../bin/colors.js";
export const metadata = {
    type: "process",
    key: "signal",
    default: false,
    showOnCLI: true,
    description: "Allow the runtime to send signals (like SIGTERM) to processes",
    action: (store) => {
        if (store?.process?.signal) {
            console.log(paint(color.cyan, "ℹ Process signaling enabled"));
        }
    }
};
//# sourceMappingURL=signal.js.map