import { getMetaValue } from "../../../meta/store.js";
import { color, paint } from "../../colors.js";
export const command = {
    name: "show <key>",
    description: "Show a metadata value",
    action(key) {
        const value = getMetaValue(key);
        console.log(paint(color.gray, `${key}:`), value);
    },
};
//# sourceMappingURL=show.js.map