import { Arguments, FunctionTool, Type } from "../types";

const List: FunctionTool = {
    name: 'ListItems',
    description: `This tool loads the items currently defined in the game.`,
    parameters: {
        title: 'filter',
        type: Type.STRING,
        description: 'Regex string to filter items by name (optional).'
    },
    callTool: async (args: Arguments<string, unknown>) => {
        console.log(`ListItems called with arguments: ${JSON.stringify(args)}`);
        if (!args) {
            return "Failed to list items: no arguments provided.";
        }
        try {
            if (!game || !game.items) {
                return "Failed to list items: game or game.items not available.";
            }

            let items = [];
            const filter = args.filter as string;
            const regex = filter ? new RegExp(filter, 'i') : null;
            for (const item of game.items) {
                if (regex && !regex.test(item.name)) {
                    continue;
                }
                items.push(item);
            }

            return `Successfully listed items: ${JSON.stringify(items)}`;
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            return `Failed to list items: ${message}`;
        }
    }
};

export default List;
 
