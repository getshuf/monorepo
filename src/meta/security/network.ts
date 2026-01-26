import type { MetaDefinition } from "../types.js";

export const metadata: MetaDefinition = {
  type: "security",
  key: "network.access",
  default: false,
  showOnCLI: true,
  description: "Allow the runtime to access external network resources"
};
