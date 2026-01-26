import { color, paint } from "../../colors.js";
export const command = {
    name: "status",
    description: "Display the current system status and metadata",
    aliases: ["st"],
    action: () => {
        console.log(paint(color.cyan, "\n❯ System Status"));
        console.log(`Version: 1.0.0`);
        console.log(`Platform: ${process.platform}`);
        console.log(`Node: ${process.version}`);
        console.log(`Time: ${new Date().toISOString()}`);
    },
};
//# sourceMappingURL=status.js.map