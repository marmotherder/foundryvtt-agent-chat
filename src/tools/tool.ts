export enum Type {
    TYPE_UNSPECIFIED = "TYPE_UNSPECIFIED",
    STRING = "STRING",
    NUMBER = "NUMBER",
    INTEGER = "INTEGER",
    BOOLEAN = "BOOLEAN",
    ARRAY = "ARRAY",
    OBJECT = "OBJECT",
    NULL = "NULL"
}

export type Arguments<K extends keyof any, T> = {
    [P in K]: T;
};

export interface FunctionToolParameter {
    title?: string;
    type?: Type;
    description?: string;
    example?: string;
    properties?: Record<string, Arguments<string, unknown>>;
    propertyOrdering?: string[];
}

export interface FunctionTool {
    name: string;
    description: string;
    parameters: FunctionToolParameter;
    callTool: (args: Arguments<string, unknown>) => Promise<string>;
}

export const Tools: FunctionTool[] = [
    {
        name: "RollDice",
        description: `This tool allows the agent to roll dice in Foundry VTT. 
                        The agent can specify the type and number of dice to roll, 
                        and the tool will return the results.`,
        parameters: {
            title: "diceroll",
            type: Type.STRING,
            description: "The dice to roll, in standard notation (e.g., '2d6+1' to roll 2 six-sided dice and add 1).",
            example: "2d6+1"
        },
        callTool: async (args: Arguments<string, unknown>) => {
            if (!args.diceroll) {
                return "Failed to roll dice: no valid 'diceroll' argument provided.";
            }

            console.log(`this is where I would log a roll, but for now I'm just capturing it: ${args.diceroll}`);

            return "Dice rolled (see logs for details)."
        }
    }
];
