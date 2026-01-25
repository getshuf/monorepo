import { Permission } from "../types/permissions.js";

/**
 * Default local permission resolver.
 * Currently allows everything.
 * Replace later with real auth logic.
 */
export const LocalPermissionResolver = {
  has(permission: Permission) {
    return true;
  }
};
