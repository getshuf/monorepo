import { paint, color } from "../../bin/colors.js";
export const metadata = {
    type: "process",
    key: "spawn",
    default: false,
    showOnCLI: true,
    description: "Allow the runtime to spawn new child processes",
    action: (store) => {
        if (store?.process?.spawn) {
            console.log(paint(color.yellow, "⚠ Security Warning: Process spawning is enabled"));
        }
    }
};
//# sourceMappingURL=spawn.js.map