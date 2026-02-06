import { Arguments, FunctionTool, Type } from "./types";

const CreateNPCTool: FunctionTool = {
    name: 'CreateNPC',
    description: `This tool creates a basic NPC with the specified name.
        It will respond with the full actor data, which can then be used to update the NPC with additional system specific data based on the json schema of the response.`,
    parameters: {
        title: 'createnpc',
        type: Type.OBJECT,
        description: 'Data for creating the NPC.',
        example: {name: "Some NPC", folder: "My Folder"},
        properties: {
            name: {
                type: Type.STRING,
                description: 'The name of the NPC to create.'
            },
            folder: {
                type: Type.STRING,
                description: 'The name of the folder to place the NPC in (optional).'
            }
        }
    },
    callTool: async (args: Arguments<string, unknown>) => {
        console.log(`CreateNPC called with arguments: ${JSON.stringify(args)}`);
        if (!args) {
            return "Failed to create NPC: no arguments provided.";
        }
        try {
            let folderId: string | undefined = undefined;
            if (args.folder) {
                folderId = game.folders?.find((f: any) => f.name === (args.folder as string) && f.type === "Actor")?._id;
            }

            let actor = await Actor.implementation.create({
                name: args.name as string,
                folder: folderId,
                type: "npc" as any
            });
            
            return `Successfully created NPC: ${JSON.stringify(actor)}`;
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            return `Failed to create NPC: ${message}`;
        }
    }
};

export default CreateNPCTool;
 
