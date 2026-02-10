import { Arguments, FunctionTool, Type } from "../types";

const Update: FunctionTool = {
    name: 'UpdateActor',
    description: `This tool updates an Actor with given ID.
        The actor ID and schema data should come from the response of the create or lookup Actor tool, which includes the full actor data structure.
        The schema will NOT be provided by this tool or description, rather the schema for this type of Actor should be inferred based on the data provided in the create or lookup response.`,
    parameters: {
        title: 'updateactor',
        type: Type.OBJECT,
        description: 'Data for updating the Actor.',
        properties: {
            id: {
                title: 'id',
                type: Type.STRING,
                description: 'The ID of the Actor to update.'
            },        
            data: {
                title: 'data',
                type: Type.OBJECT,
                description: 'Additional data to update the Actor with, based off of the schema provided by the create or lookup Actor tool.',
                example: {"system": {"health": {"value": 1, "max": 10}}}
            }
        },
        required: ['id', 'data']
    },
    callTool: async (args: Arguments<string, unknown>) => {
        console.log(`UpdateActor called with arguments: ${JSON.stringify(args)}`);
        if (!args) {
            return "Failed to update Actor: no arguments provided.";
        }
        try {
            const actor = Actor.implementation.get(args.id as string);
            if (!actor) {
                return `Failed to update Actor: no actor found with ID ${args.id}`;
            }
            await actor.update(args.data as Record<string, unknown>);
            
            return `Successfully updated Actor: ${JSON.stringify(actor)}`;
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            return `Failed to update Actor: ${message}`;
        }
    }
};

export default Update;
 
