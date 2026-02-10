import { Arguments, FunctionTool, Type } from "../types";

const List: FunctionTool = {
    name: 'ListFolders',
    description: `This tools gets a list of folders loaded into the game, based on type.
    Folders are presented in a flat results, but may have nested hierarchy in Foundry, based on the parent field.`,
    parameters: {
        title: 'listfolders',
        type: Type.OBJECT,
        description: 'Data for listing folders.',
        properties: {
            items: {
                title: 'items',
                type: Type.BOOLEAN,
                description: 'Whether to list item folders.'
            },        
            actors: {
                title: 'actors',
                type: Type.BOOLEAN,
                description: 'Whether to list actor folders.'
            }
        },
        required: ['items', 'actors']
    },
    callTool: async (args: Arguments<string, unknown>) => {
        console.log(`ListFolders called with arguments: ${JSON.stringify(args)}`);
        if (!args) {
            return "Failed to list folders: no arguments provided.";
        }
        try {
            if (!game || !game.folders) {
                return "Failed to list folders: game or game.folders not available.";
            }

            let results = {
                items: [] as {name: string, id: string, depth: number | undefined, parentId: string | undefined}[],
                actors: [] as {name: string, id: string, depth: number | undefined, parentId: string | undefined}[]
            }

            if (args.items) {
                const itemFolders = game.folders.filter(p => p.type === "Item");
                for (const itemFolder of itemFolders) {
                    let folder: {name: string, id: string, depth: number | undefined, parentId: string | undefined} = {
                        name: itemFolder.name,
                        id: itemFolder.id,
                        depth: itemFolder.depth,
                        parentId: undefined
                    }
                    
                    if (itemFolder.folder) {
                        folder.parentId = itemFolder.folder.id;
                    }

                    results.items.push(folder);
                }
            }

            if (args.actors) {
                const actorFolders = game.folders.filter(p => p.type === "Actor");
                for (const actorFolder of actorFolders) {
                    let folder: {name: string, id: string, depth: number | undefined, parentId: string | undefined} = {
                        name: actorFolder.name,
                        id: actorFolder.id,
                        depth: actorFolder.depth,
                        parentId: undefined
                    }
                    
                    if (actorFolder.folder) {
                        folder.parentId = actorFolder.folder.id;
                    }

                    results.actors.push(folder);
                }
            }
            
            return `Successfully listed folders: ${JSON.stringify(results)}`;
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            return `Failed to list folders: ${message}`;
        }
    }
};

export default List;
 
