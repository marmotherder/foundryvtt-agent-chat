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
                type: Type.STRING,
                description: 'The ID of the NPC to update.'
            },
            name: {
                type: Type.STRING,
                description: 'The name of the NPC being updated.'
            },            
            data: {
                type: Type.OBJECT,
                description: 'Additional data to update the NPC with, based off of the schema provided by the create or lookup NPC tool.'
            }
        }
    },
    callTool: async (args: Arguments<string, unknown>) => {
        console.log(`UpdateNPC called with arguments: ${JSON.stringify(args)}`);
        if (!args) {
            return "Failed to update NPC: no arguments provided.";
        }
        try {
            const id = args.id as string | undefined;
            if (!id) return `Failed to update NPC: missing id`;

            const actor = Actor.implementation.get(id);
            if (!actor) return `Failed to update NPC: no actor found with ID ${id}`;

            const incomingName = args.name as string | undefined;
            const original = args.data && typeof args.data === 'object'
                ? args.data as Record<string, any>
                : {};

            const data: Record<string, any> = { ...original };

            if (incomingName) data.name = incomingName;

            data.prototypeToken = { ...(data.prototypeToken as Record<string, any> || {}) };
            if (incomingName) data.prototypeToken.name = incomingName;

            console.log(`UpdateNPC: updating actor ${id} with`, JSON.stringify(data));

            await actor.update(data as Record<string, unknown>);

            return `Successfully updated NPC: ${JSON.stringify(actor)}`;
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            return `Failed to create NPC: ${message}`;
        }
    }
};

export default UpdateNPCTool;
 
