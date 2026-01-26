import type { CommandDefinition } from "../../loader.js";

export const command: CommandDefinition = {
  name: "echo",
  description: "Print the provided arguments",
  action: (...args: any[]) => {
    const options = args.pop();
    console.log(args.join(" "));
  },
};
