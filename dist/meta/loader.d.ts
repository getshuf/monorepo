/**
 * Loads meta type definitions from dist/meta/<type>/*.js
 * Allows 3rd party packages to provide meta schemas
 */
export interface MetaTypeDefinition {
    type: string;
    schema?: {
        safeParse(path: string): {
            success: boolean;
        };
    };
}
/**
 * Loads meta type definitions from:
 *  - Built-in dist/meta/*
 *  - External paths listed in ~/.shuffle.json under "meta.paths"
 */
export declare function loadMetaTypes(): Promise<Map<string, MetaTypeDefinition>>;
//# sourceMappingURL=loader.d.ts.map