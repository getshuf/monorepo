import type { CommandDefinition } from "../../loader.js";

export const command: CommandDefinition = {
  name: "ping",
  description: "Check if the CLI is responsive",
  action: () => {
    console.log("pong 🏓");
  },
};
