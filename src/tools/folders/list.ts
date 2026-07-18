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
            },
            limit: {
                title: 'limit',
                type: Type.INTEGER,
                description: 'Maximum number of results to return.',
                example: 50
            },
            offset: {
                title: 'offset',
                type: Type.INTEGER,
                description: 'Number of items to skip (used for pagination).',
                example: 0
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
                let itemFolders = game.folders.filter(p => p.type === "Item");
                const start = Number(args.offset) || 0;
                const limit = args.limit ? Number(args.limit) : itemFolders.length;
                itemFolders = itemFolders.slice(start, start + limit);

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
                let actorFolders = game.folders.filter(p => p.type === "Actor");
                const start = Number(args.offset) || 0;
                const limit = args.limit ? Number(args.limit) : actorFolders.length;
                actorFolders = actorFolders.slice(start, start + limit);

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
            
            // --- Start of formatted output generation ---

            let markdownOutput = "### 📁 Folder Listing Results\n";

            if (results.items.length > 0) {
                markdownOutput += "\n#### Item Folders\n";
                markdownOutput += "| Name | ID | Depth | Parent ID |\n";
                markdownOutput += "| :--- | :---: | :---: | :---: |\n";
                results.items.forEach(folder => {
                    markdownOutput += `| ${folder.name} | ${folder.id} | ${folder.depth ?? 'N/A'} | ${folder.parentId ?? 'None'} |\n`;
                });
            } else {
                markdownOutput += "\n#### Item Folders\nNo item folders found.\n";
            }

            if (results.actors.length > 0) {
                markdownOutput += "\n#### Actor Folders\n";
                markdownOutput += "| Name | ID | Depth | Parent ID |\n";
                markdownOutput += "| :--- | :---: | :---: | :---: |\n";
                results.actors.forEach(folder => {
                    markdownOutput += `| ${folder.name} | ${folder.id} | ${folder.depth ?? 'N/A'} | ${folder.parentId ?? 'None'} |\n`;
                });
            } else {
                markdownOutput += "\n#### Actor Folders\nNo actor folders found.\n";
            }

            return markdownOutput;
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            return `❌ **Error Listing Folders**: Failed to retrieve folder data due to an API or runtime error. Please check the game state or permissions. Details: \n\`\`\`\n${message}\n\`\`\``;
        }
    }
};

export default List;
 
