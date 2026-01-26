import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import { Command } from "commander";
import { color, paint } from "./colors.js";
import { loadUserMeta, getMetaValue } from "../meta/store.js";
/* -------------------------------------------------- */
/* Loader                                              */
/* -------------------------------------------------- */
export async function loadCommands(program, baseDir, resolver) {
    const categories = readDirs(baseDir);
    for (const categoryName of categories) {
        const categoryPath = path.join(baseDir, categoryName);
        const categoryCmd = program
            .command(categoryName)
            .description(paint(color.cyan, `${categoryName} commands`));
        const files = readFiles(categoryPath);
        for (const file of files) {
            if (shouldSkipFile(file))
                continue;
            const fullPath = path.join(categoryPath, file);
            try {
                const mod = await import(pathToFileURL(fullPath).href);
                if (!mod.command) {
                    warn(`Skipped ${file} (no export "command")`);
                    continue;
                }
                registerCommand(categoryCmd, categoryName, mod.command, resolver);
            }
            catch (err) {
                error(`Failed loading ${file}`, err?.message || err);
            }
        }
    }
}
/* -------------------------------------------------- */
/* Registration                                        */
/* -------------------------------------------------- */
function registerCommand(categoryCmd, categoryName, def, resolver) {
    let cmd = categoryCmd.command(def.name);
    if (def.description)
        cmd.description(def.description);
    if (def.hidden)
        cmd.hidden();
    if (def.aliases)
        for (const a of def.aliases)
            cmd.alias(a);
    if (def.options) {
        for (const opt of def.options) {
            cmd.option(opt.flags, opt.description, opt.default);
        }
    }
    if (def.examples?.length) {
        cmd.addHelpText("after", "\nExamples:\n" +
            def.examples.map(e => `  $ ${e}`).join("\n") +
            "\n");
    }
    if (def.deprecated) {
        cmd.addHelpText("before", paint(color.yellow, `⚠ Deprecated: ${def.deprecated}\n\n`));
    }
    cmd.action(async (...args) => {
        const options = args.at(-1);
        const pureArgs = args.slice(0, -1);
        const ctx = {
            category: categoryName,
            name: def.name,
            options,
            args: pureArgs,
            startTime: Date.now(),
            permissions: resolver
        };
        try {
            if (def.permissions)
                checkPermissions(resolver, def.permissions);
            // Real-time metadata check for security
            const store = loadUserMeta();
            const metaKey = `${categoryName}.${def.name}`;
            const isBlocked = getMetaValue(store, categoryName, def.name, true) === false ||
                getMetaValue(store, categoryName, def.name, true) === "false";
            if (isBlocked) {
                throw new Error(`Command "${metaKey}" is disabled in security settings.`);
            }
            if (def.before)
                await def.before(ctx);
            if (def.validate)
                await def.validate(ctx);
            await def.action(...args);
            if (def.after)
                await def.after(ctx);
            showTiming(ctx);
        }
        catch (err) {
            error("Command failed", err?.message || err);
            process.exit(1);
        }
    });
}
/* -------------------------------------------------- */
/* Permission Check                                    */
/* -------------------------------------------------- */
function checkPermissions(resolver, perms) {
    for (const perm of perms) {
        if (!resolver.has(perm)) {
            throw new Error(`Missing permission: ${perm}`);
        }
    }
}
/* -------------------------------------------------- */
/* Filesystem Helpers                                  */
/* -------------------------------------------------- */
function shouldSkipFile(file) {
    return (file.endsWith(".d.ts") ||
        file.endsWith(".map") ||
        file.startsWith("_"));
}
function readDirs(dir) {
    try {
        return fs.readdirSync(dir, { withFileTypes: true })
            .filter(d => d.isDirectory())
            .map(d => d.name);
    }
    catch {
        return [];
    }
}
function readFiles(dir) {
    try {
        return fs.readdirSync(dir)
            .filter(f => /\.(ts|js|mjs|cjs)$/.test(f));
    }
    catch {
        return [];
    }
}
/* -------------------------------------------------- */
/* Diagnostics                                         */
/* -------------------------------------------------- */
function showTiming(ctx) {
    const ms = Date.now() - ctx.startTime;
    console.log(paint(color.gray, `• Completed in ${ms}ms`));
}
function warn(msg) {
    console.warn(paint(color.yellow, `⚠ ${msg}`));
}
function error(title, msg) {
    console.error(paint(color.red, `✖ ${title}: ${msg}`));
}
//# sourceMappingURL=loader.js.map