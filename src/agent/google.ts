import { CallableTool, Chat, FunctionCall, GenerateContentConfig, GoogleGenAI, Part, Tool, Type} from "@google/genai";
import SystemInstruction from "./instructions";
import Tools from "../tools/tools";

export default class GoogleAgent {
    ai: GoogleGenAI;
    config: GenerateContentConfig;
    chat: Chat;

    constructor(apiKey: string, additionalSystemInstructions = "", temperature = 0.2, maxOutputTokens = 2048) {
        this.ai = new GoogleGenAI({apiKey: apiKey});

        let tools: CallableTool[] = [];
        for (const tool of Tools) {
            tools.push({
                async tool(): Promise<Tool> {
                    return {
                        functionDeclarations: [
                            {
                                name: tool.name,
                                description: tool.description,
                                parameters: {
                                    title: tool.parameters.title,
                                    type: tool.parameters.type,
                                    description: tool.parameters.description,
                                    example: tool.parameters.example,
                                    properties: tool.parameters.properties,
                                    propertyOrdering: tool.parameters.propertyOrdering
                                }
                            }
                        ]
                    }
                },
                async callTool(functionCalls: FunctionCall[]): Promise<Part[]> {
                    let results: string[] = [];
                    for (const call of functionCalls) {
                        results.push(await tool.callTool(call.args as Record<string, unknown>));
                    }
                    return [
                        { text: results.join("\n") },
                    ];
                }
            })
        }

        this.config = {
                systemInstruction: `${SystemInstruction}\n${additionalSystemInstructions}`,
                temperature: temperature,
                maxOutputTokens: maxOutputTokens,
                tools: tools
            }
        this.chat = this.ai.chats.create({
            model: "gemini-3-flash-preview",
            config: this.config
        });
    }

    RestartChat() {
        this.chat = this.ai.chats.create({
            model: "gemini-3-flash-preview",
            config: this.config
        });
    }

    async Chat(contents: string): Promise<string> {
        const response = await this.chat.sendMessage({
            message: contents,
        });
        return response.text ?? "the agent did not return any text";
    }
}
