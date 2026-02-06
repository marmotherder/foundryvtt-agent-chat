export const MODULE_NAME = "foundryvtt-agent-chat";
export const SETTING_API_KEY = "apiKey";

Hooks.once("init", () => {
  console.log(`${MODULE_NAME} | Initializing module`);

  if (typeof game === 'undefined' || !game.settings) {
    console.warn(`${MODULE_NAME} | game or game.settings not available during init - skipping settings registration`);
    return;
  }

  game.settings.register(MODULE_NAME, SETTING_API_KEY, {
    name: "API Key",
    hint: "Your API key for the agent service.",
    scope: "client",
    config: true,
    type: String,
    default: "",
    onChange: (value: string) => {
      console.log(`${MODULE_NAME} | Setting ${SETTING_API_KEY} changed`);
    }
  });
});

Hooks.once("ready", () => {
  console.log(`${MODULE_NAME} | Ready`);
});

export function simplePing(): string {
  return `${MODULE_NAME} pong`;
}

// Helper to read configured API key
export function getApiKey(): string {
  if (typeof game === 'undefined' || !game.settings) return "";
  return (game.settings.get(MODULE_NAME, SETTING_API_KEY) as string) ?? "";
}

Hooks.on("chatMessage", (chatLog: ChatLog<ChatLog.RenderContext, ChatLog.Configuration, ChatLog.RenderOptions>, message: string, chatData: {
    user: string;
    speaker: ReturnType<ChatMessage.ImplementationClass["getSpeaker"]>;
}) => {
  if (message.startsWith("/agent")) {
    const apiKey = getApiKey(); 
    console.log(apiKey);
  }
});
