import type { MetaDefinition } from "../types.js";

export const metadata: MetaDefinition = {
  type: "process",
  key: "signal",
  default: false,
  showOnCLI: true,
  description: "Allow the runtime to send signals (like SIGTERM) to processes"
};
