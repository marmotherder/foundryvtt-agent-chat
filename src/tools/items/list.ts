import { Arguments, FunctionTool, Type } from "../types";

const List: FunctionTool = {
    name: 'ListItems',
    description: `This tool loads the items currentlty defined in the game.`,
    parameters: {},
    callTool: async (args: Arguments<string, unknown>) => {
        console.log(`ListItems called with arguments: ${JSON.stringify(args)}`);
        if (!args) {
            return "Failed to list items: no arguments provided.";
        }
        try {
            return `Successfully listed items: ${JSON.stringify(game.items)}`;
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            return `Failed to list items: ${message}`;
        }
    }
};

export default List;
 
