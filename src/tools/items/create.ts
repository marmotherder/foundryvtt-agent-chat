import { Arguments, FunctionTool, Type } from "../types";

const Create: FunctionTool = {
    name: 'CreateItem',
    description: `This tool creates a basic Item with the specified name.
        Items are typically equipment, spells, or other objects that can be owned by Actors in Foundry. The created Item will be based on the default prototype for the specified type, which may vary based on the system being used.
        It will respond with the full item data, which can then be used to update the Item with additional system specific data based on the json schema of the response.`,
    parameters: {
        title: 'createitem',
        type: Type.OBJECT,
        description: 'Data for creating the Item.',
        example: {name: "Some Item", folder: "My Folder"},
        properties: {
            name: {
                type: Type.STRING,
                description: 'The name of the Item to create.'
            },
            folder: {
                type: Type.STRING,
                description: 'The name of the folder to place the Item in (optional).'
            },
            itemtype: {
                type: Type.STRING,
                description: 'The type of the item, based on the system being used. Types should be interpretted based on retrieved examples from compendiums or existing items, and may not be consistent across systems.',
            }
        },
        required: ['name', "itemtype"]
    },
    callTool: async (args: Arguments<string, unknown>) => {
        console.log(`CreateItem called with arguments: ${JSON.stringify(args)}`);
        if (!args) {
            return "Failed to create Item: no arguments provided.";
        }
        try {
            let folderId: string | undefined = undefined;
            if (args.folder) {
                folderId = game.folders?.find((f: any) => f.name === (args.folder as string) && f.type === "Item")?._id;
            }

            const item = await Item.implementation.create({
                name: args.name as string,
                folder: folderId,
                type: args.itemtype as any,
            });
            
            return `Successfully created Item: ${JSON.stringify(item)}`;
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            return `Failed to create Item: ${message}`;
        }
    }
};

export default Create;