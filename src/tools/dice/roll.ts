import { Arguments, FunctionTool, Type } from "../types"

const RollTool: FunctionTool = {
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
        console.log(`RollDice called with arguments: ${JSON.stringify(args)}`);
        if (!args || !args.diceroll) {
            return "Failed to roll dice: no 'diceroll' argument provided.";
        }
        try {
            const roll = new Roll(args.diceroll as string);
            const result =await roll.roll();
            return `Successfully rolled ${args.diceroll}: ${result.result}`;
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            return `Invalid dice expression: ${message}`;
        }
    }
}

export default RollTool;
