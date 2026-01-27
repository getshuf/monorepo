import type { MetaDefinition } from "../../meta/types.js";

export const metadata: MetaDefinition = {
  type: "system",
  key: "info",
  default: true,
  showOnCLI: true,
  description: "Allow the CLI to display system information"
};
