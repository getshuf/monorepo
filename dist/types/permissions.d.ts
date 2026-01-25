/**
 * Central permission definitions for Shuffle
 */
export declare enum Permission {
    RuntimeStart = "runtime:start",
    RuntimeStop = "runtime:stop",
    RuntimeInspect = "runtime:inspect",
    PackagePublish = "package:publish",
    PackageRemove = "package:remove",
    ConfigRead = "config:read",
    ConfigWrite = "config:write",
    MetaRead = "meta:read",
    MetaWrite = "meta:write",
    DevInspect = "dev:inspect",
    Admin = "*"
}
export type PermissionSet = Permission[];
export interface PermissionResolver {
    has(permission: Permission): boolean;
}
//# sourceMappingURL=permissions.d.ts.map