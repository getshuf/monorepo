import type { MetaDefinition } from "../types.js";

export const metadata: MetaDefinition = {
  type: "process",
  key: "kill",
  default: false,
  showOnCLI: true,
  description: "Allow the runtime to terminate existing processes"
};
