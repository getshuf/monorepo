import type { MetaDefinition } from "../types.js";

export const metadata: MetaDefinition = {
  type: "network",
  key: "inbound",
  default: false,
  showOnCLI: true,
  description: "Allow the runtime to accept incoming network connections"
};
