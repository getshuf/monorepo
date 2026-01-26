import type { MetaDefinition } from "../types.js";

export const metadata: MetaDefinition = {
  type: "security",
  key: "secret.read",
  default: false,
  showOnCLI: true,
  description: "Allow the runtime to read system secrets and environment variables"
};
