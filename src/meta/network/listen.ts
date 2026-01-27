import type { MetaDefinition } from "../../meta/types.js";
import type { AddressInfo } from "net";
import { createServer, type Server, type Socket } from "net";
import * as crypto from "crypto";
import { getMetaValue, loadUserMeta } from "../../meta/store.js";
import { color, paint } from "../../bin/colors.js";

export const metadata: MetaDefinition = {
  type: "network",
  key: "listen",
  default: false,
  showOnCLI: true,
  description:
    "Create a TCP server to listen for incoming connections, e.g. for remote debugging or CLI access",
  action: async (store: any) => {
    const enabled = getMetaValue(store, "network", "listen", false);
    if (enabled) {
      await startServer();
    } else {
      stopServer();
    }
  }
};

let server: Server | null = null;
let listening = false;

/* -------------------- Shuffle Handler -------------------- */

function shuffle(conn: Socket, data: string) {
  const content = data.replace(/^shuffle!/i, "").trim();

  if (!content) {
    const hash = crypto.createHash("sha256").update(`No query provided`).digest("hex");
    conn.write(`error: ${hash}\n`);
    return;
  }

  try {
    const query = JSON.parse(content);
    if (!query || typeof query !== "object") {
      const hash = crypto.createHash("sha256").update(`Invalid query`).digest("hex");
      conn.write(`error: ${hash}\n`);
      return;
    }
    // Handle query logic here
    conn.write("ok\n");
  } catch (e) {
    const hash = crypto.createHash("sha256").update(`Invalid JSON`).digest("hex");
    conn.write(`error: ${hash}\n`);
  }
}

/* -------------------- Input Dispatcher -------------------- */

function on(conn: Socket, raw: string) {
  const data = raw.trim();

  if (/^shuffle!/i.test(data)) {
    shuffle(conn, data);
    return;
  }

  conn.write("Fail to parse input\n");
}

/* -------------------- Server Lifecycle -------------------- */

export async function startServer() {
  if (listening) return;

  const store = loadUserMeta();
  const port = getMetaValue(store, "network", "port", 8888);
  const host = getMetaValue(store, "network", "host", "127.0.0.1");

  server = createServer((conn) => {
    conn.on("data", (buf) => on(conn, buf.toString()));
    conn.on("error", () => {});
  });

  return new Promise<void>((resolve, reject) => {
    server?.listen(port, host, () => {
      listening = true;
      const addr = server?.address() as AddressInfo;
      console.log(paint(color.green, `✔ Network listener active on ${addr.address}:${addr.port}`));
      resolve();
    });

    server?.on("error", (err) => {
      console.error(paint(color.red, `✖ Failed to start network listener: ${err.message}`));
      reject(err);
    });
  });
}

export function stopServer() {
  if (!listening) return;
  server?.close(() => {
    listening = false;
    server = null;
    console.log(paint(color.yellow, "⚠ Network listener stopped"));
  });
}
