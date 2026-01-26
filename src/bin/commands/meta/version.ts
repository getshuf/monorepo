import type { CommandDefinition } from "../../loader.js";
import { color, paint } from "../../colors.js";

export const command: CommandDefinition = {
  name: "version",
  description: "Display CLI version information",
  aliases: ["v"],
  action: () => {
    console.log(paint(color.green, "Shuffle CLI v1.0.0"));
  },
};
