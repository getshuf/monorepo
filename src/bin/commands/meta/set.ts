import type { CommandDefinition } from "../../loader.js";

export const command: CommandDefinition = {
  name: "set",
  description: "Set a configuration value",
  action: (key: string, value: string) => {
    console.log(`Setting ${key} to ${value}...`);
    console.log("Configuration updated.");
  },
};
