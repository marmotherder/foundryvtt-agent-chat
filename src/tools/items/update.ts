import { Arguments, FunctionTool, Type } from "../types";

const Update: FunctionTool = {
    name: 'UpdateItem',
    description: `This tool updates an Item with given ID.
        The item ID and schema data should come from the response of the create or lookup Item tool, which includes the full item data structure.
        The schema will NOT be provided by this tool or description, rather the schema for this type of Item should be inferred based on the data provided in the create or lookup response.`,
    parameters: {
        title: 'updateitem',
        type: Type.OBJECT,
        description: 'Data for updating the Item.',
        properties: {
            id: {
                title: 'id',
                type: Type.STRING,
                description: 'The ID of the Item to update.'
            },        
            data: {
                title: 'data',
                type: Type.OBJECT,
                description: 'Additional data to update the Item with, based off of the schema provided by the create or lookup Item tool.',
                example: {"system": {"health": {"value": 1, "max": 10}}}
            }
        },
        required: ['id', 'data']
    },
    callTool: async (args: Arguments<string, unknown>) => {
        console.log(`UpdateItem called with arguments: ${JSON.stringify(args)}`);
        if (!args) {
            return "Failed to update Item: no arguments provided.";
        }
        try {
            const item = Item.implementation.get(args.id as string);
            if (!item) {
                return `Failed to update Item: no item found with ID ${args.id}`;
            }
            await item.update(args.data as Record<string, unknown>);
            
            return `Successfully updated Item: ${JSON.stringify(item)}`;
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            return `Failed to update Item: ${message}`;
        }
    }
};

export default Update;
 
