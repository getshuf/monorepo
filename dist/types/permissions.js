/**
 * Central permission definitions for Shuffle
 */
export var Permission;
(function (Permission) {
    Permission["RuntimeStart"] = "runtime:start";
    Permission["RuntimeStop"] = "runtime:stop";
    Permission["RuntimeInspect"] = "runtime:inspect";
    Permission["PackagePublish"] = "package:publish";
    Permission["PackageRemove"] = "package:remove";
    Permission["ConfigRead"] = "config:read";
    Permission["ConfigWrite"] = "config:write";
    Permission["MetaRead"] = "meta:read";
    Permission["MetaWrite"] = "meta:write";
    Permission["DevInspect"] = "dev:inspect";
    Permission["SystemUpdate"] = "system:update";
    Permission["UserManage"] = "user:manage";
    Permission["LogsRead"] = "logs:read";
    Permission["DatabaseQuery"] = "db:query";
    Permission["DatabaseWrite"] = "db:write";
    Permission["ProcessSpawn"] = "process:spawn";
    Permission["ProcessKill"] = "process:kill";
    Permission["ProcessSignal"] = "process:signal";
    Permission["EnvironmentRead"] = "env:read";
    Permission["EnvironmentWrite"] = "env:write";
    Permission["NetworkOutbound"] = "network:outbound";
    Permission["NetworkInbound"] = "network:inbound";
    Permission["NetworkListen"] = "network:listen";
    Permission["Admin"] = "*";
})(Permission || (Permission = {}));
//# sourceMappingURL=permissions.js.map