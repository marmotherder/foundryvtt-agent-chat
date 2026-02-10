import { Arguments, FunctionTool, Type } from "../types";

const Get: FunctionTool = {
    name: 'GetCompendium',
    description: `This tool gets the entries of a compendium based on the compendium ID.
    Compendium IDs based on their entry types can be found using the ListCompendiums tool.`,
    parameters: {
        title: 'id',
        type: Type.STRING,
        description: 'The ID of the compendium to get.',
    },
    callTool: async (args: Arguments<string, unknown>) => {
        console.log(`GetCompendium called with arguments: ${JSON.stringify(args)}`);
        if (!args) {
            return "Failed to get compendium: no arguments provided.";
        }
        try {
            if (!game || !game.packs) {
                return "Failed to get compendium: game or game.packs not available.";
            }

            const compendium = game.packs.find(p => p.metadata.id === args.id);
            if (!compendium) {
                return `Failed to get compendium: no compendium found with id ${args.id}`;
            }

            return `Successfully got compendium: ${JSON.stringify(compendium)}`;
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            return `Failed to get compendium: ${message}`;
        }
    }
};

export default Get;
 
