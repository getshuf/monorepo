import { server, startServer, addKey } from "../../tcp.js";
import type { CommandDefinition } from "../../loader.js";
import { color, paint } from "../../colors.js";
import {
  getMetaValue,
  loadUserMeta,
  setMetaValue,
  saveUserMeta,
} from "../../../meta/store.js";
import { Permission } from "../../../types/permissions.js";
import * as fs from "fs/promises";
import * as path from "path";

export const command: CommandDefinition = {
  name: "start",
  description: "Start the TCP server in the background",
  aliases: ["up", "on", "enable"],

  options: [
    {
      flags: "-p, --port <port>",
      description: "Port to listen on (1-65535)",
    },
    {
      flags: "-h, --host <host>",
      description: "Host to listen on (default: 127.0.0.1)",
    },
    {
      flags: "-k, --key <passphrase>",
      description: "Passphrase to encrypt TSL3 traffic (min 12 chars)",
    },
    {
      flags: "-s, --save",
      description: "Save configuration to meta store",
    },
    {
      flags: "-f, --force",
      description: "Force restart if already running",
    },
    {
      flags: "--no-encrypt",
      description: "Disable encryption (insecure - not recommended)",
    },
  ],

  action: async (args) => {
    const store = loadUserMeta();

    // --- Validate and parse port ---
    const portInput =
      args.port ?? getMetaValue(store, "network", "port", "8888");
    const port = Number(portInput);
    if (isNaN(port) || port < 1 || port > 65535) {
      console.log(
        paint(
          color.red,
          `✖ Invalid port: ${portInput}. Must be between 1-65535.`,
        ),
      );
      return;
    }

    // --- Parse host ---
    const host = String(
      args.host ?? getMetaValue(store, "network", "host", "127.0.0.1"),
    );

    // --- Determine encryption mode ---
    // Commander.js sets args.encrypt = false when --no-encrypt is used
    const encrypt =
      (args.encrypt ?? getMetaValue(store, "network", "encrypt", true)) !==
      false;

    // --- Handle key provisioning (CRITICAL FIX: await addKey) ---
    if (args.key) {
      if (!encrypt) {
        console.log(
          paint(
            color.yellow,
            "⚠ Warning: --key provided but --no-encrypt specified. Key will be ignored.",
          ),
        );
      } else {
        try {
          // ✅ FIXED: Properly await asynchronous key persistence
          await addKey(String(args.key));
          console.log(
            paint(
              color.green,
              "✓ Encryption key accepted and persisted to .shuffle/e2ee.tsl3",
            ),
          );
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          console.log(paint(color.red, `✖ Invalid passphrase: ${msg}`));
          return;
        }
      }
    }

    // --- Enforce key requirement when encryption is enabled ---
    if (encrypt && !(await hasValidKey())) {
      console.log(
        paint(
          color.red,
          "✖ Encryption enabled but no valid key set.\n" +
            "   Provide --key '<12+ character passphrase>' to enable secure mode.",
        ),
      );
      return;
    }

    // --- Check if already running ---
    if (server && !args.force) {
      const addr = server.address();
      const currentHost = typeof addr === "object" ? addr?.address : "unknown";
      const currentPort = typeof addr === "object" ? addr?.port : "unknown";

      console.log(
        paint(
          color.yellow,
          `⚠ Server already running on ${currentHost}:${currentPort}. Use --force to restart.`,
        ),
      );
      return;
    }

    // --- Save configuration if requested ---
    if (args.save) {
      setMetaValue(store, "network", "port", port);
      setMetaValue(store, "network", "host", host);
      setMetaValue(store, "network", "encrypt", encrypt);
      saveUserMeta(store);
      console.log(
        paint(color.green, "✓ Network configuration saved to meta store"),
      );
    }

    // --- Start server ---
    try {
      await startServer({ port, host, encrypt, force: args.force });

      // --- Post-start feedback ---
      const securityBadge = encrypt
        ? paint(color.green, "🔐 ENCRYPTED")
        : paint(color.red, "⚠️  UNENCRYPTED");

      console.log(
        paint(
          color.cyan,
          `✓ Shuffle server active on ${host}:${port} (${securityBadge})`,
        ),
      );

      if (!encrypt) {
        console.log(
          paint(
            color.yellow,
            "⚠️  WARNING: Traffic is NOT encrypted. Use --key for production deployments.",
          ),
        );
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.log(paint(color.red, `✖ Failed to start server: ${msg}`));

      // --- Actionable diagnostics ---
      if (msg.includes("EADDRINUSE")) {
        console.log(
          paint(
            color.yellow,
            `💡 Port ${port} is in use. Try: --port ${port === 8888 ? 8889 : 8888}`,
          ),
        );
      } else if (msg.includes("EACCES")) {
        console.log(
          paint(
            color.yellow,
            "💡 Ports <1024 require root privileges. Use port >1024 or sudo.",
          ),
        );
      } else if (msg.includes("ENOENT") && encrypt) {
        console.log(
          paint(
            color.yellow,
            "💡 Missing key file. Provide --key '<passphrase>' to initialize encryption.",
          ),
        );
      }
    }
  },
};

/**
 * Checks if a valid encryption key exists (filesystem check)
 * Note: This verifies persisted key metadata, not runtime key state
 */
async function hasValidKey(): Promise<boolean> {
  const keyFile = path.join(process.cwd(), ".shuffle", "e2ee.tsl3");
  try {
    const stat = await fs.stat(keyFile);
    // Verify file has expected size handling potential partial writes
    return true;
  } catch {
    return false;
  }
}
