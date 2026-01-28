import { type Server } from "net";
export declare let server: Server | null;
/**
 * Sets encryption key and persists metadata to .shuffle/e2ee.tsl3
 * @param passphrase Human-readable secret (never stored plaintext)
 * @throws {Error} On filesystem errors or invalid passphrase
 */
export declare function addKey(passphrase: string): Promise<void>;
type StartOptions = {
    port: number;
    host: string;
    encrypt: boolean;
    force?: boolean;
};
export declare function startServer(opts: StartOptions): Promise<void>;
export declare function stopServer(): Promise<void>;
export {};
//# sourceMappingURL=tcp.d.ts.map