/**
 * Parses CLI string input into JSON-serializable values
 */
export function parseJSONValue(input) {
    if (input === undefined || input === null)
        return undefined;
    const trimmed = input.trim();
    if (trimmed === "true")
        return true;
    if (trimmed === "false")
        return false;
    if (trimmed === "null")
        return null;
    if (trimmed === "undefined")
        return undefined;
    // Handle numbers
    if (!isNaN(Number(trimmed)) && trimmed !== "") {
        return Number(trimmed);
    }
    // Handle JSON structures
    if ((trimmed.startsWith("{") && trimmed.endsWith("}")) ||
        (trimmed.startsWith("[") && trimmed.endsWith("]")) ||
        (trimmed.startsWith('"') && trimmed.endsWith('"'))) {
        try {
            return JSON.parse(trimmed);
        }
        catch {
            // Fallback to literal string if JSON parse fails
            return trimmed;
        }
    }
    // Handle comma-separated lists as arrays
    if (trimmed.includes(",") && !trimmed.startsWith("[") && !trimmed.startsWith("{")) {
        return trimmed.split(",").map(s => parseJSONValue(s.trim()));
    }
    return trimmed;
}
/**
 * Validates a value against a metadata definition
 */
export function validateMetaValue(meta, value) {
    if (meta.type === "boolean" && typeof value !== "boolean")
        return false;
    if (meta.type === "number" && typeof value !== "number")
        return false;
    if (meta.type === "string" && typeof value !== "string")
        return false;
    return true;
}
//# sourceMappingURL=parser.js.map