import type { MetaDefinition } from "../../meta/types.js";
import { getMetaValue } from "../../meta/store.js";
import { color, paint } from "../../bin/colors.js";
import { startServer, stopServer, server } from "../../bin/tcp.js";
import type { Socket } from "net";

export const metadata: MetaDefinition = {
  type: "network",
  key: "listen",
  default: false,
  showOnCLI: true,
  description:
    "Create a TCP server to listen for incoming connections, e.g. for remote debugging or CLI access",
  action: async (store: any) => {
    const enabled = getMetaValue(store, "network", "listen", false);
    const maxConnections = getMetaValue(store, "network", "maxConnections", 5);
    const logConnections = getMetaValue(store, "network", "logConnections", true);

    if (enabled) {
      console.log(paint(color.cyan, `ℹ Initializing network listener (Max Connections: ${maxConnections})...`));
      
      // Configuration validation
      if (maxConnections < 1) {
        console.warn(paint(color.yellow, "⚠ Invalid maxConnections. Resetting to default (5)."));
      }

      await startServer();
      
      if (server) {
        server.maxConnections = maxConnections;
        if (logConnections) {
          server.on("connection", (socket: Socket) => {
            const remote = `${socket.remoteAddress}:${socket.remotePort}`;
            console.log(paint(color.gray, `• Connection established from ${remote}`));
            socket.on("close", () => {
              console.log(paint(color.gray, `• Connection closed from ${remote}`));
            });
          });
        }
      }
    } else {
      stopServer();
    }
  }
};
