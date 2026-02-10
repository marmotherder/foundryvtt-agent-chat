import { Arguments, FunctionTool, Type } from "../types";

const List: FunctionTool = {
    name: 'ListActors',
    description: `This tool loads the actors currently defined in the game.`,
    parameters: {},
    callTool: async (args: Arguments<string, unknown>) => {
        console.log(`ListActors called with arguments: ${JSON.stringify(args)}`);
        if (!args) {
            return "Failed to list actors: no arguments provided.";
        }
        try {
            return `Successfully listed actors: ${JSON.stringify(game.actors)}`;
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            return `Failed to list actors: ${message}`;
        }
    }
};

export default List;
 
