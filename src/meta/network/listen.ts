import type { MetaDefinition } from "../../meta/types.js";

export const metadata: MetaDefinition = {
  type: "network",
  key: "listen",
  default: false,
  showOnCLI: true,
  description: "Allow the runtime to listen for incoming network connections"
};
