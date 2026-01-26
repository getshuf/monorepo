/**
 * Central permission definitions for Shuffle
 */

export enum Permission {
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
  SystemUpdate = "system:update",
  UserManage = "user:manage",
  LogsRead = "logs:read",
  NetworkAccess = "network:access",
  FileSystemWrite = "fs:write",
  SecretRead = "secret:read",
  Admin = "*",
}

export type PermissionSet = Permission[];

export interface PermissionResolver {
  has(permission: Permission): boolean;
}
