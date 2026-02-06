export const moduleName = "foundryvtt-agent-chat"
export const settingAPIKey = "apiKey";

Hooks.once("init", () => {
  console.log(`${moduleName} | Initializing module`);

  if (typeof game === 'undefined' || !game.settings || !game.i18n) {
    console.warn(`${moduleName} | game or game properties not available during init - skipping settings registration`);
    return;
  }

  game.settings.register(moduleName, settingAPIKey, {
    name: game.i18n.localize("foundryvtt-agent-chat.settings.apiKey.name"),
    hint: game.i18n.localize("foundryvtt-agent-chat.settings.apiKey.hint"),
    scope: "client",
    config: true,
    type: String,
    default: "",
    onChange: (value: string) => {
      console.log(`${moduleName} | Setting ${settingAPIKey} changed`);
    }
  });
});

Hooks.once("ready", () => {
  console.log(`${moduleName} | Ready`);
});

export function simplePing(): string {
  return `${moduleName} pong`;
}

// Helper to read configured API key
export function getApiKey(): string {
  if (typeof game === 'undefined' || !game.settings) return "";
  return (game.settings.get(moduleName, settingAPIKey) as string) ?? "";
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
