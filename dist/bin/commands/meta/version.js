import { color, paint } from "../../colors.js";
export const command = {
    name: "version",
    description: "Display CLI version information",
    aliases: ["v"],
    action: () => {
        console.log(paint(color.green, "Shuffle CLI v1.0.0"));
    },
};
//# sourceMappingURL=version.js.map