export const metadata = {
    type: "network",
    key: "listen",
    default: false,
    showOnCLI: true,
    description: "Allow the runtime to listen for incoming network connections",
    action: async (store) => {
        // If 'network.listen' is enabled, we could perform background logic here.
        // However, the current requirement is to 'Run a source code silent if enabled'.
        // This is typically handled by the loader/runner, but we can ensure 
        // it doesn't block by returning immediately if needed.
        return;
    }
};
//# sourceMappingURL=listen.js.map