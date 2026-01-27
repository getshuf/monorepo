import { createServer } from "net";
import * as crypto from "crypto";
import { getMetaValue, loadUserMeta } from "../meta/store.js";
import { color, paint } from "./colors.js";
/**
 * $ shuffle tcp <subcommand>
 *
 * Shuffle TCP is a portable TCP server that can be used to expose your Shuffle homeserver
 *
 * [!] It'll spawn a new process and run in the background until you stop it by using `shuffle tcp stop`
 *     You can also use `shuffle tcp status` to check if it's running
 *     and `shuffle tcp mp/port` to check the port it's running on
 *
 **/
export let server = null;
let listening = false;
/* -------------------- Shuffle Handler -------------------- */
function shuffle(conn, data) {
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
    }
    catch (e) {
        const hash = crypto.createHash("sha256").update(`Invalid JSON`).digest("hex");
        conn.write(`error: ${hash}\n`);
    }
}
/* -------------------- Input Dispatcher -------------------- */
function on(conn, raw) {
    const data = raw.trim();
    if (/^shuffle!/i.test(data)) {
        shuffle(conn, data);
        return;
    }
    conn.write("Fail to parse input\n");
}
/* -------------------- Server Lifecycle -------------------- */
export async function startServer() {
    if (listening)
        return;
    const store = loadUserMeta();
    const port = getMetaValue(store, "network", "port", 8888);
    const host = getMetaValue(store, "network", "host", "127.0.0.1");
    server = createServer((conn) => {
        conn.on("data", (buf) => on(conn, buf.toString()));
        conn.on("error", (err) => {
            console.error(paint(color.red, `✖ Connection error: ${err.message}`));
        });
    });
    return new Promise((resolve, reject) => {
        server?.listen(port, host, () => {
            listening = true;
            const addr = server?.address();
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
    if (!listening)
        return;
    server?.close(() => {
        listening = false;
        server = null;
        console.log(paint(color.yellow, "⚠ Network listener stopped"));
    });
}
//# sourceMappingURL=tcp.js.map