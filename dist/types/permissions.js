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
    Permission["Admin"] = "*";
})(Permission || (Permission = {}));
//# sourceMappingURL=permissions.js.map