import type { CommandDefinition } from "../../loader.js";

export const command: CommandDefinition = {
  name: "time",
  description: "Display current local time",
  action: () => {
    console.log(new Date().toLocaleTimeString());
  },
};
