import { Permission } from "../types/permissions.js";
import { loadUserMeta } from "../meta/store.js";

/**
 * Default local permission resolver.
 * Checks against the user's meta store for a "permissions" type.
 */
export const LocalPermissionResolver = {
  has(permission: Permission): boolean {
    const store = loadUserMeta();
    const userPermissions = store.permissions || {};
    
    // Admin override
    if (userPermissions["*"] === true || userPermissions["*"] === "true") {
      return true;
    }

    return userPermissions[permission] === true || userPermissions[permission] === "true";
  }
};
