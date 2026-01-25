import { Command } from "commander";
import type { Permission, PermissionResolver } from "../types/permissions.js";
import type { CLIContext } from "../types/context.js";
export interface CommandContext {
    category: string;
    name: string;
    options: any;
    args: any[];
    startTime: number;
}
export interface CommandDefinition {
    name: string;
    description?: string;
    aliases?: string[];
    options?: Array<{
        flags: string;
        description?: string;
        default?: any;
    }>;
    examples?: string[];
    hidden?: boolean;
    deprecated?: string;
    permissions?: Permission[];
    before?: (ctx: CommandContext & CLIContext) => Promise<void> | void;
    after?: (ctx: CommandContext & CLIContext) => Promise<void> | void;
    validate?: (ctx: CommandContext & CLIContext) => Promise<void> | void;
    action: (...args: any[]) => any | Promise<any>;
}
export declare function loadCommands(program: Command, baseDir: string, resolver: PermissionResolver): Promise<void>;
//# sourceMappingURL=loader.d.ts.map