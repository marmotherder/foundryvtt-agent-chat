declare global {
  interface SettingConfig {
    "foundryvtt-agent-chat.provider": string;
    "foundryvtt-agent-chat.model": string;
    "foundryvtt-agent-chat.additionalSystemInstructions": string;
    "foundryvtt-agent-chat.temperature": number;
    "foundryvtt-agent-chat.endpoint": string;
    "foundryvtt-agent-chat.apiKey": string;
    "foundryvtt-agent-chat.maxOutputTokens": number;
  }
}

export {};
