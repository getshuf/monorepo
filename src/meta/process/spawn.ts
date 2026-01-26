import type { MetaDefinition } from "../types.js";

export const metadata: MetaDefinition = {
  type: "process",
  key: "spawn",
  default: false,
  showOnCLI: true,
  description: "Allow the runtime to spawn new child processes"
};
