import { Permission } from "../types/permissions.js";
/**
 * Default local permission resolver.
 * Currently allows everything.
 * Replace later with real auth logic.
 */
export const LocalPermissionResolver = {
    has(permission) {
        return true;
    }
};
//# sourceMappingURL=permissions-local.js.map