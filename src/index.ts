import GoogleAgent from "./agent/google";

const moduleName = "foundryvtt-agent-chat"
const settingAPIKey = "apiKey";
const settingAdditionalSystemInstructions = "additionalSystemInstructions";

let agent: GoogleAgent;

Hooks.once("init", () => {
  console.log(`${moduleName} | Initializing module`);

  if (typeof game === 'undefined' || !game.settings || !game.i18n) {
    console.warn(`${moduleName} | game or game properties not available during init - skipping settings registration`);
    return;
  }

  game.settings.register(moduleName, settingAPIKey, {
    name: game.i18n.localize("foundryvtt-agent-chat.settings.apiKey.name"),
    hint: game.i18n.localize("foundryvtt-agent-chat.settings.apiKey.hint"),
    scope: "world",
    config: true,
    type: String,
    default: "",
    requiresReload: true,
    onChange: (value: string) => {
      console.log(`${moduleName} | Setting ${settingAPIKey} changed`);
    }
  });

  game.settings.register(moduleName, settingAdditionalSystemInstructions, {
    name: game.i18n.localize("foundryvtt-agent-chat.settings.additionalSystemInstructions.name"),
    hint: game.i18n.localize("foundryvtt-agent-chat.settings.additionalSystemInstructions.hint"),
    scope: "world",
    config: true,
    type: String,
    default: "",
    requiresReload: true,
    onChange: (value: string) => {
      console.log(`${moduleName} | Setting ${settingAdditionalSystemInstructions} changed`);
    }
  });

  const gameSystemInstruction = game.system?.description ? `The game system being used is ${game.system.description}.` : "";
  const additionalSystemInstructions = (game.settings.get(moduleName, settingAdditionalSystemInstructions) as string) ?? "";

  agent = new GoogleAgent(getApiKey(), `${gameSystemInstruction}\n${additionalSystemInstructions}`);
});
  
Hooks.once("ready", () => {
  console.log(`${moduleName} | Ready`);
});

// Helper to read configured API key
function getApiKey(): string {
  if (typeof game === 'undefined' || !game.settings) {
    console.warn(`${moduleName} | game or game properties not available during init - unable to read API key`);
    return "";
  }

  return (game.settings.get(moduleName, settingAPIKey) as string) ?? "";
}

Hooks.on("chatMessage", (chatLog: ChatLog<ChatLog.RenderContext, ChatLog.Configuration, ChatLog.RenderOptions>, message: string, chatData: {
    user: string;
    speaker: ReturnType<ChatMessage.ImplementationClass["getSpeaker"]>;
}) => {
  // Only handle the command we care about
  if (!message.startsWith("!agent")) return;

  if (message.startsWith("!agent restart")) {
    agent.RestartChat();
    return;
  }

  const prompt = message.replace("!agent", "").trim();

  agent.Chat(prompt).then(response => {
    ChatMessage.create({
      content: response,
      speaker: chatData.speaker,
    });
  }).catch(error => {
    console.error(`${moduleName} | Error processing agent chat message:`, error);
    const errMsg = error instanceof Error ? error.message : String(error);
    ui?.notifications?.warn(`${moduleName}: failed to process agent chat message — ${errMsg}`);
  });

  return false;
});
