import type { MetaDefinition } from "../types.js";

export const metadata: MetaDefinition = {
  type: "security",
  key: "fs.write",
  default: false,
  showOnCLI: true,
  description: "Allow the runtime to write to the local filesystem"
};
