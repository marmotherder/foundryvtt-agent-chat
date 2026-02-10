# Foundry VTT Agent Chat

Agent Chat is a Foundry VTT module that integrates LLM-based agents into the game's chat interface. It currently supports Google Gemini and local Ollama instances. The agent can perform actions within the world such as creating NPCs, rolling dice, and querying game data.

## Features

The module provides an intelligent agent capable of interacting with Foundry VTT through several integrated tools:

*   **NPC Management:** Create and update NPC actors directly from natural language prompts.
*   **Dice Rolling:** Execute complex dice rolls and interpret results.
*   **Data Querying:** List and search for items, actors, and compendium content to assist in session management.

## Installation

1.  Open the Foundry VTT Setup screen.
2.  Go to the **Modules** tab.
3.  Click **Install Module**.
4.  Paste the manifest URL: `https://github.com/marmotherder/foundryvtt-agent-chat/releases/latest/download/module.json`
5.  Click **Install**.

## Configuration

After installation, configure which provider the module should use and any provider-specific settings in Foundry's Configure Settings for the world.

Settings added by this module

- `provider` (choice): Select between `Google Gemini` and `Ollama`.
- `model` (string): Model identifier for the selected provider (defaults to `gemini-3-flash-preview` for Google).
- `temperature` (number): Sampling temperature for the agent (default `0.2`).
- `endpoint` (string): Base endpoint for Ollama (or a proxy) — leave empty for the default local Ollama address.
- `apiKey` (string): API key for Google Gemini or Ollama Cloud, if applicable.
- `maxOutputTokens` (number): Max tokens when using Google Gemini (default `2048`).
- `additionalSystemInstructions` (string): Extra system instructions appended to the agent's system prompt.

Provider notes

- Google Gemini: enter a valid API key in `apiKey` and choose the appropriate `model` and `maxOutputTokens`.
- Ollama (local or cloud): set `provider` to Ollama and configure `endpoint` to point at your Ollama server or a CORS-enabled proxy. For local Ollama, the default server is `http://127.0.0.1:11434`. If you use Ollama Cloud, provide the cloud `host` and an API key in `apiKey` (via a proxy or environment-secured server-side code).

If you run Foundry in a browser context, note that a direct request from the renderer to `http://127.0.0.1:11434` will be blocked by CORS unless the Ollama server provides the appropriate headers. The recommended approach is to run a small local proxy that adds CORS headers and forwards requests to Ollama (see `ollamaproxy/README.md`).

## Usage

Interact with the agent using the `!agent` command prefix in the chat sidebar.

*   `!agent [your prompt]`: Send a message or command to the agent.
*   `!agent restart`: Resets the current chat history to start a fresh conversation.

Example commands:
*   `!agent Create a level 5 Goblin Shaman with 30 HP.`
*   `!agent Roll 2d20 + 5 for an initiative check.`
*   `!agent Find all items in the Equipment compendium.`

## Development

If you wish to modify or contribute to the module, you can set up a local development environment.

### Prerequisites

*   Node.js and npm
*   A local Foundry VTT installation

### Steps

1.  Clone the repository into your Foundry `Data/modules/foundryvtt-agent-chat` directory.
2.  Run `npm install` to install dependencies.
3.  Run `npm run build` to compile the TypeScript sources into the distribution bundle.
4.  Use `npm run watch` to automatically recompile during development.

### Testing

The project uses Jest for testing. Run tests using:
```bash
npm test
```

## License

This project is licensed under the MIT License.

## Notes

- When changing provider or model settings, a reload may be required because the module initializes the agent during `init`.
- Make tools idempotent where possible — the agent may request the same tool multiple times while reasoning.
