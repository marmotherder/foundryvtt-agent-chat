# Foundry VTT Agent Chat

Agent Chat is a Foundry VTT module that integrates a tool supporting LLM (currently only Gemini) directly into the game's chat interface. It allows Game Masters to interact with an AI agent that can perform actions within the world, such as creating NPCs, rolling dice, and querying game data.

## Features

The module provides an intelligent agent capable of interacting with Foundry VTT through several integrated tools:

*   **NPC Management:** Create and update NPC actors directly from natural language prompts.
*   **Dice Rolling:** Execute complex dice rolls and interpret results.
*   **Data Querying:** List and search for items, actors, and compendium content to assist in session management.

## Installation

1.  Open the Foundry VTT Setup screen.
2.  Go to the **Modules** tab.
3.  Click **Install Module**.
4.  Paste the manifest URL: `https://github.com/your-username/foundryvtt-agent-chat/releases/latest/download/module.json`
5.  Click **Install**.

## Configuration

After installation, you must configure the module to use the Google Gemini API:

1.  Navigate to **Configure Settings** within your world.
2.  Locate the **Agent Chat** section.
3.  Enter your **Google Gemini API Key**.
4.  (Optional) Provide **Additional System Instructions** to guide the agent's personality or specific house rules.
5.  Save settings and reload the application.

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
