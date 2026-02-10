import { Arguments, FunctionTool, Type } from "../types";

const Create: FunctionTool = {
    name: 'CreateActor',
    description: `This tool creates a basic Actor with the specified name.
        Actors are typically player characters, NPCs, and other interactable entities in Foundry. The created Actor will be based on the default prototype for the specified type, which may vary based on the system being used.
        It will respond with the full actor data, which can then be used to update the Actor with additional system specific data based on the json schema of the response.`,
    parameters: {
        title: 'createactor',
        type: Type.OBJECT,
        description: 'Data for creating the Actor.',
        example: {name: "Some Actor", folder: "My Folder"},
        properties: {
            name: {
                type: Type.STRING,
                description: 'The name of the Actor to create.'
            },
            folder: {
                type: Type.STRING,
                description: 'The name of the folder to place the Actor in (optional).'
            },
            actortype: {
                type: Type.STRING,
                description: 'The type of the actor, based on the system being used. Types should be interpretted based on retrieved examples from compendiums or existing actors, and may not be consistent across systems. (optional, defaults to "npc")',
            }
        },
        required: ['name']
    },
    callTool: async (args: Arguments<string, unknown>) => {
        console.log(`CreateActor called with arguments: ${JSON.stringify(args)}`);
        if (!args) {
            return "Failed to create Actor: no arguments provided.";
        }
        try {
            let folderId: string | undefined = undefined;
            if (args.folder) {
                folderId = game.folders?.find((f: any) => f.name === (args.folder as string) && f.type === "Actor")?._id;
            }

            let actortype: string = "npc";

            if (args.actortype) {
                actortype = args.actortype as string;
            }

            let actor = await Actor.implementation.create({
                name: args.name as string,
                folder: folderId,
                type: actortype as any,
                prototypeToken: {
                    name: args.name as string
                }
            });
            
            return `Successfully created Actor: ${JSON.stringify(actor)}`;
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            return `Failed to create Actor: ${message}`;
        }
    }
};

export default Create;