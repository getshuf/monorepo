import { Permission } from "../../../types/permissions.js";
import type { CommandDefinition } from "../../loader.js";
import { color, paint } from "../../colors.js";

export const command: CommandDefinition = {
  name: "test-perm",
  description: "Test permission checking logic",
  permissions: [Permission.DevInspect],
  action: () => {
    console.log(paint(color.green, "✔ Permission check passed! You have dev:inspect access."));
  },
};
