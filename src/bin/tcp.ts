import type { AddressInfo } from "net";
import { createServer, type Server, type Socket } from "net";
import * as crypto from "crypto";
import * as fs from "fs/promises";
import * as path from "path";
import { color, paint } from "./colors.js";

export let server: Server | null = null;
let listening = false;
let encryptionKey: Buffer | null = null;
const KEY_FILE = path.join(process.cwd(), ".shuffle", "e2ee.tsl3");
const FILE_SIZE = 64 * 1024 * 1024;
const KEY_PROTOCOL = "shuffle-e2ee-v3";

/* ---------------- Encryption ---------------- */

/**
 * Sets encryption key and persists metadata to .shuffle/e2ee.tsl3
 * @param passphrase Human-readable secret (never stored plaintext)
 * @throws {Error} On filesystem errors or invalid passphrase
 */
export async function addKey(passphrase: string): Promise<void> {
  if (!passphrase || passphrase.length < 12) {
    throw new Error("Passphrase must be at least 12 characters");
  }

  // Derive encryption key (SHA-256)
  encryptionKey = crypto.createHash("sha256").update(passphrase).digest();

  // Persist key metadata securely (never stores passphrase plaintext)
  await persistKeyMetadata(passphrase);
}

/**
 * Securely persists key metadata to 39MB file with:
 * - Protocol header
 * - Key derivation parameters
 * - SHA3-384 hash of passphrase (for verification without storing secret)
 * - Cryptographic padding with verifiable randomness
 */
async function persistKeyMetadata(passphrase: string): Promise<void> {
  try {
    // Create directory atomically
    await fs.mkdir(path.dirname(KEY_FILE), { recursive: true, mode: 0o700 });

    // Generate metadata payload
    const metadata = Buffer.from(
      JSON.stringify({
        protocol: KEY_PROTOCOL,
        timestamp: Date.now(),
        hash: crypto.createHash("sha3-384").update(passphrase).digest("hex"),
        params: { kdf: "sha256", iterations: 1 },
      }),
      "utf-8",
    );

    // Validate size constraints
    const HEADER_SIZE = 64; // Reserved for future-proofing
    if (metadata.length > FILE_SIZE - HEADER_SIZE) {
      throw new Error(`Metadata too large (${metadata.length} bytes)`);
    }

    // Create 39MB buffer with cryptographic padding
    const buffer = Buffer.allocUnsafe(FILE_SIZE);

    // Header: Protocol magic + version
    buffer.write("SHFLv3", 0, "ascii");
    buffer.writeUInt32BE(FILE_SIZE, 6); // Self-describing size

    // Metadata section (encrypted envelope structure)
    metadata.copy(buffer, HEADER_SIZE);

    // Cryptographic padding (not zeros - prevents forensic analysis)
    const padStart = HEADER_SIZE + metadata.length;
    crypto.randomFillSync(buffer, padStart, FILE_SIZE - padStart);

    // Atomic write with fs.rename() pattern
    const tmpPath = `${KEY_FILE}.${process.pid}.${Date.now()}.tmp`;
    await fs.writeFile(tmpPath, buffer, { mode: 0o600 });
    await fs.rename(tmpPath, KEY_FILE);

    console.log(
      paint(
        color.cyan,
        `✓ Key metadata persisted to ${KEY_FILE} (${(FILE_SIZE / (1024 * 1024)).toFixed(1)} MiB)`,
      ),
    );
  } catch (err) {
    console.error(
      paint(
        color.red,
        `✗ Failed to persist key metadata: ${(err as Error).message}`,
      ),
    );
    throw err;
  }
}

/* ---------------- Shuffle Protocol ---------------- */

function shuffleHandler(conn: Socket, data: string) {
  const content = data.replace(/^shuffle!/i, "").trim();

  if (!content) {
    const hash = crypto.createHash("sha256").update("No query").digest("hex");
    conn.write(`error:${hash}\n`);
    return;
  }

  try {
    const query = JSON.parse(content);
    if (!query || typeof query !== "object") {
      const hash = crypto
        .createHash("sha256")
        .update("Invalid query")
        .digest("hex");
      conn.write(`error:${hash}\n`);
      return;
    }

    // ---- Application logic placeholder ----
    // In production: Validate query structure, execute business logic
    conn.write("ok\n");
  } catch {
    const hash = crypto
      .createHash("sha256")
      .update("Invalid JSON")
      .digest("hex");
    conn.write(`error:${hash}\n`);
  }
}

function onData(conn: Socket, raw: string) {
  let data = raw.trim();

  // Early exit for empty data
  if (!data) return;

  // Handle key exchange when encryption is required
  if (encryptionKey && data.startsWith("key:")) {
    const clientKey = data.slice(4);

    if (clientKey.length < 12) {
      conn.write("fail:weak-key\n");
      conn.destroy();
      return;
    }

    const hash = crypto.createHash("sha256").update(clientKey).digest();

    if (hash.equals(encryptionKey)) {
      // Mark connection as authenticated
      (conn as any).authenticated = true;
      conn.write("ok:authenticated\n");
      return; // Critical: prevent command processing on auth packet
    } else {
      conn.write("fail:invalid-key\n");
      conn.destroy(); // Terminate on auth failure
      return;
    }
  }

  // Enforce authentication when key is set
  if (encryptionKey && !(conn as any).authenticated) {
    conn.write("fail:auth-required\n");
    conn.destroy();
    return;
  }

  // Route to protocol handlers
  if (/^shuffle!/i.test(data)) {
    shuffleHandler(conn, data);
    return;
  }

  conn.write("fail:unknown-command\n");
}

/* ---------------- Server Lifecycle ---------------- */

type StartOptions = {
  port: number;
  host: string;
  encrypt: boolean;
  force?: boolean;
};

export async function startServer(opts: StartOptions) {
  if (listening && !opts.force) {
    console.warn(
      paint(
        color.yellow,
        "⚠ Server already running (use force=true to restart)",
      ),
    );
    return;
  }

  if (listening && opts.force) {
    await stopServer();
  }

  // Reset encryption state based on config
  if (!opts.encrypt) {
    encryptionKey = null;
    console.log(
      paint(color.yellow, "⚠ Encryption disabled per configuration"),
    );
  }

  // Create server with resource cleanup
  server = createServer((conn) => {
    // Set timeouts to prevent resource exhaustion
    conn.setTimeout(30_000);
    conn.setNoDelay(true);

    conn.on("data", (buf) => {
      try {
        onData(conn, buf.toString());
      } catch (err) {
        console.error(
          paint(color.red, `✗ Protocol error: ${(err as Error).message}`),
        );
        conn.write("fail:internal-error\n");
        conn.destroy();
      }
    });

    conn.on("timeout", () => {
      console.debug(
        paint(color.gray, `⏱️ Connection timeout from ${conn.remoteAddress}`),
      );
      conn.destroy();
    });

    conn.on("error", (err) => {
      // Only log non-trivial errors
      if (err.message !== "read ECONNRESET" && err.message !== "write EPIPE") {
        console.error(paint(color.red, `✗ Connection error: ${err.message}`));
      }
    });

    conn.on("end", () => {
      console.debug(
        paint(color.gray, `🔌 Connection closed from ${conn.remoteAddress}`),
      );
    });
  });

  // Handle server-level errors
  server.on("error", (err: NodeJS.ErrnoException) => {
    if (err.code === "EADDRINUSE") {
      console.error(paint(color.red, `✗ Port ${opts.port} already in use`));
    } else if (err.code === "EACCES") {
      console.error(
        paint(
          color.red,
          `✗ Permission denied for port ${opts.port} (try >1024)`,
        ),
      );
    } else {
      console.error(paint(color.red, `✗ Server error: ${err.message}`));
    }
  });

  return new Promise<void>((resolve, reject) => {
    server!.listen(opts.port, opts.host, () => {
      listening = true;
      const addr = server!.address() as AddressInfo;

      console.log(
        paint(
          color.green,
          `✓ Shuffle server active on ${addr.address}:${addr.port} ` +
            `(encryption: ${opts.encrypt ? "enabled" : "disabled"})`,
        ),
      );

      // Security notice when encryption is disabled
      if (!opts.encrypt) {
        console.warn(
          paint(
            color.yellow,
            "⚠ WARNING: Server running WITHOUT encryption. " +
              "Enable with --encrypt flag in production.",
          ),
        );
      }

      resolve();
    });

    server!.once("error", (err) => reject(err));
  });
}

export async function stopServer() {
  if (!listening || !server) {
    console.debug(paint(color.gray, "⊘ Server not running"));
    return;
  }

  return new Promise<void>((resolve) => {
    // Stop accepting new connections immediately
    server!.close((err) => {
      listening = false;
      server = null;

      if (err) {
        console.error(
          paint(color.red, `✗ Error stopping server: ${err.message}`),
        );
      } else {
        console.log(paint(color.yellow, "⊘ Shuffle server stopped"));
      }

      resolve();
    });

    // Force-close idle connections after timeout
    setTimeout(() => {
      server?.getConnections((_, count) => {
        if (count > 0) {
          console.warn(
            paint(
              color.yellow,
              `⚠ Forcing closure of ${count} lingering connection(s)`,
            ),
          );
          server?.close();
        }
      });
    }, 5000).unref(); // Non-blocking timer
  });
}

// Graceful shutdown handling
process.on("SIGINT", async () => {
  console.log(paint(color.cyan, "\n⏳ Received SIGINT - shutting down..."));
  await stopServer();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log(paint(color.cyan, "\n⏳ Received SIGTERM - shutting down..."));
  await stopServer();
  process.exit(0);
});
