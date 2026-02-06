export const MODULE_NAME = "foundryvtt-agent-chat";
Hooks.once("init", () => {
    console.log(`${MODULE_NAME} | Initializing module`);
});
Hooks.once("ready", () => {
    console.log(`${MODULE_NAME} | Ready`);
});
export function simplePing() {
    return `${MODULE_NAME} pong`;
}
// Add module-specific initialization and APIs below.
//# sourceMappingURL=index.js.map