import GoogleAgent from "./agent/google";
import OllamaAgent from "./agent/ollama";

const moduleName = "foundryvtt-agent-chat"
const settingProvider = "provider";
const settingModel = "model";
const settingAdditionalSystemInstructions = "additionalSystemInstructions";
const settingTemperature = "temperature";
const settingEndpoint = "endpoint";
const settingAPIKey = "apiKey";
const settingMaxOutputTokens = "maxOutputTokens";

let agent: GoogleAgent | OllamaAgent;

Hooks.once("init", () => {
  console.log(`${moduleName} | Initializing module`);

  if (typeof game === 'undefined' || !game.settings || !game.i18n) {
    console.warn(`${moduleName} | game or game properties not available during init - skipping settings registration`);
    return;
  }

  game.settings.register(moduleName, settingProvider, {
    name: game.i18n.localize("foundryvtt-agent-chat.settings.provider.name"),
    hint: game.i18n.localize("foundryvtt-agent-chat.settings.provider.hint"),
    scope: "world",
    config: true,
    type: String,
    choices: {
      google: "Google Gemini",
      ollama: "Ollama"
    },
    default: "google",
    requiresReload: true,
    onChange: (value: string) => {
      console.log(`${moduleName} | Setting ${settingProvider} changed`);
    }
  });

  game.settings.register(moduleName, settingModel, {
    name: game.i18n.localize("foundryvtt-agent-chat.settings.model.name"),
    hint: game.i18n.localize("foundryvtt-agent-chat.settings.model.hint"),
    scope: "world",
    config: true,
    type: String,
    default: "gemini-3-flash-preview",
    requiresReload: true,
    onChange: (value: string) => {
      console.log(`${moduleName} | Setting ${settingModel} changed`);
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

  game.settings.register(moduleName, settingTemperature, {
    name: game.i18n.localize("foundryvtt-agent-chat.settings.temperature.name"),
    hint: game.i18n.localize("foundryvtt-agent-chat.settings.temperature.hint"),
    scope: "world",
    config: true,
    type: Number,
    default: 0.2,
    requiresReload: true,
    onChange: (value: number) => {
      console.log(`${moduleName} | Setting ${settingTemperature} changed`);
    }
  });

  game.settings.register(moduleName, settingEndpoint, {
    name: game.i18n.localize("foundryvtt-agent-chat.settings.endpoint.name"),
    hint: game.i18n.localize("foundryvtt-agent-chat.settings.endpoint.hint"),
    scope: "world",
    config: true,
    type: String,
    default: "",
    requiresReload: true,
    onChange: (value: string) => {
      console.log(`${moduleName} | Setting ${settingEndpoint} changed`);
    }
  });

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

  game.settings.register(moduleName, settingMaxOutputTokens, {
    name: game.i18n.localize("foundryvtt-agent-chat.settings.maxOutputTokens.name"),
    hint: game.i18n.localize("foundryvtt-agent-chat.settings.maxOutputTokens.hint"),
    scope: "world",
    config: true,
    type: Number,
    default: 2048,
    requiresReload: true,
    onChange: (value: number) => {
      console.log(`${moduleName} | Setting ${settingMaxOutputTokens} changed`);
    }
  });

  const gameSystemInstruction = game.system?.description ? `The game system being used is ${game.system.description}.` : "";
  const additionalSystemInstructions = (game.settings.get(moduleName, settingAdditionalSystemInstructions) as string) ?? "";

  const model = game.settings.get(moduleName, settingModel) as string;
  const temperature = game.settings.get(moduleName, settingTemperature) as number;

  switch (game.settings.get(moduleName, settingProvider) as string) {
    case "google":
      const maxOutputTokens = game.settings.get(moduleName, settingMaxOutputTokens) as number;
      agent = new GoogleAgent(model, getApiKey(), `${gameSystemInstruction}\n${additionalSystemInstructions}`, temperature, maxOutputTokens);
      break;
    case "ollama":
      const endpoint = game.settings.get(moduleName, settingEndpoint) as string;
      agent = new OllamaAgent(model, `${gameSystemInstruction}\n${additionalSystemInstructions}`, temperature, endpoint);
      break;
    default:
      console.warn(`${moduleName} | Invalid provider setting - defaulting to Google Gemini`);
      agent = new GoogleAgent(model, getApiKey(), `${gameSystemInstruction}\n${additionalSystemInstructions}`);
  }
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
