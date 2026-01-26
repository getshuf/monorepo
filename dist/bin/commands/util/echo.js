export const command = {
    name: "echo",
    description: "Print the provided arguments",
    action: (...args) => {
        const options = args.pop();
        console.log(args.join(" "));
    },
};
//# sourceMappingURL=echo.js.map