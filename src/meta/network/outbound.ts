import type { MetaDefinition } from "../types.js";

export const metadata: MetaDefinition = {
  type: "network",
  key: "outbound",
  default: false,
  showOnCLI: true,
  description: "Allow the runtime to make outgoing network requests"
};
