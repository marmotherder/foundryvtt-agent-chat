import { Arguments, FunctionTool, Type } from "./types";

const UpdateNPCTool: FunctionTool = {
    name: 'UpdateNPC',
    description: `This tool updates an NPC with given ID.
        The actor ID and schema data should come from the response of the create or lookup NPC tool, which includes the full actor data structure.
        The schema will NOT be provided by this tool or description.`,
    parameters: {
        title: 'updatenpc',
        type: Type.OBJECT,
        description: 'Data for updating the NPC.',
        properties: {
            id: {
                title: 'id',
                type: Type.STRING,
                description: 'The ID of the NPC to update.'
            },        
            data: {
                title: 'data',
                type: Type.OBJECT,
                description: 'Additional data to update the NPC with, based off of the schema provided by the create or lookup NPC tool.',
                example: {"system": {"health": {"value": 1, "max": 10}}}
            }
        },
        required: ['id', 'data']
    },
    callTool: async (args: Arguments<string, unknown>) => {
        console.log(`UpdateNPC called with arguments: ${JSON.stringify(args)}`);
        if (!args) {
            return "Failed to update NPC: no arguments provided.";
        }
        try {
            const actor = Actor.implementation.get(args.id as string);
            if (!actor) {
                return `Failed to update NPC: no actor found with ID ${args.id}`;
            }
            await actor.update(args.data as Record<string, unknown>);
            
            return `Successfully updated NPC: ${JSON.stringify(actor)}`;
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            return `Failed to create NPC: ${message}`;
        }
    }
};

export default UpdateNPCTool;
 
