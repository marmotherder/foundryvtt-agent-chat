import { Ollama, Tool, Message } from 'ollama/browser'
import SystemInstruction from "./instructions";
import Tools from "../tools/tools";

export default class OllamaAgent {
    ai: Ollama;
    model: string;
    systemInstruction: string;
    tools: Tool[];
    temperature: number;
    messages: Message[];

    constructor(model: string, additionalSystemInstructions = "", temperature = 0.2, endpoint = "http://127.0.0.1:11434") {
        this.model = model;
        this.systemInstruction = `${SystemInstruction}\n${additionalSystemInstructions}`;
        this.tools = [];
        this.temperature = temperature;

        this.ai = new Ollama({ host: endpoint });

        for (const tool of Tools) {
            this.tools.push({
                type: "function",
                function: {
                    name: tool.name,
                    description: tool.description,
                    parameters: (() => { 
                        let parameters = {
                            type: tool.parameters.type,
                            required: tool.parameters.required,
                            properties: {} as { [key: string]: {} }
                        }

                        for (const [k, v] of Object(tool.parameters.properties).entries()) {
                            parameters.properties[k] = {
                                type: v.type,
                                description: v.description,
                            }
                        }

                        return parameters;
                     })()
                }
            });
        }

        this.messages = [];
        this.RestartChat();
    }

    RestartChat() {
        this.messages = [{
            role: "system",
            content: this.systemInstruction
        }];
    }

    async Chat(contents: string): Promise<string> {
        this.messages.push({
            role: "user",
            content: contents
        });

        let cont = true;
        let responseMessage = "execution stack exceeded without returning a final answer";
        while (cont) { 
            const response = await this.ai.chat({
                model: this.model,
                tools: this.tools,
                think: true,
                options:{
                    temperature: this.temperature,
                },
                messages: this.messages,
                stream: false
            });

            this.messages.push(response.message);

            if (response.message.tool_calls) {
                for (const call of response.message.tool_calls) {
                    const tool = Tools.find(t => t.name === call.function.name);
                    if (!tool) {
                        throw new Error(`Tool ${call.function.name} not found`);
                    }
                    const toolResult = await tool?.callTool(call.function.arguments);
                    
                    this.messages.push({
                        role: "tool",
                        content:toolResult,
                        tool_name: call.function.name,
                    });
                }
            }

            if (response.done) {
                cont = false;
                responseMessage = response.message.content as string;
            }
        }
        return responseMessage;
    }
}
