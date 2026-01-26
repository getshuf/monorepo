import fs from "fs";
import path from "path";
const CONFIG_PATH = path.join(process.cwd(), "shuffle.config.json");
export const command = {
    name: "set <key> <value>",
    description: "Set a configuration value in shuffle.config.json",
    action: (key, value) => {
        let config = {};
        if (fs.existsSync(CONFIG_PATH)) {
            try {
                config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf-8"));
            }
            catch (e) {
                console.error("Error reading existing config, creating new one.");
            }
        }
        config[key] = value;
        fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
        console.log(`Successfully set "${key}" to "${value}" in shuffle.config.json`);
    },
};
//# sourceMappingURL=set.js.map