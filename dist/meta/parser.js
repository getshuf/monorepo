/**
 * Parses CLI string input into JSON-serializable values
 */
export function parseJSONValue(input) {
    if (input === "true")
        return true;
    if (input === "false")
        return false;
    if (input === "null")
        return null;
    if (!isNaN(Number(input)))
        return Number(input);
    if ((input.startsWith("{") && input.endsWith("}")) ||
        (input.startsWith("[") && input.endsWith("]")) ||
        (input.startsWith('"') && input.endsWith('"'))) {
        return JSON.parse(input);
    }
    return input;
}
//# sourceMappingURL=parser.js.map