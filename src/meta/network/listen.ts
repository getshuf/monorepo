import type { MetaDefinition } from "../../meta/types.js";

export const metadata: MetaDefinition = {
  type: "network",
  key: "listen",
  default: false,
  showOnCLI: true,
  description: "Allow the runtime to listen for incoming network connections",
  action: async (store: any) => {
    // If 'network.listen' is enabled, we could perform background logic here.
    // However, the current requirement is to 'Run a source code silent if enabled'.
    // This is typically handled by the loader/runner, but we can ensure 
    // it doesn't block by returning immediately if needed.
    return;
  }
};
