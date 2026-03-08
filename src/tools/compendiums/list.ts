import { Arguments, FunctionTool, Type } from "../types";

const List: FunctionTool = {
    name: 'ListCompendiums',
    description: `This tools gets a list of compendiums loaded into the game, based on type.
    The label on results is the human readable name of the compendium, which should be used for filtering, if multiple systems are present.`,
    parameters: {
        title: 'listcompendiums',
        type: Type.OBJECT,
        description: 'Data for listing compendiums.',
        properties: {
            items: {
                title: 'items',
                type: Type.BOOLEAN,
                description: 'Whether to list item compendiums.'
            },        
            actors: {
                title: 'actors',
                type: Type.BOOLEAN,
                description: 'Whether to list actor compendiums.'
            },
            filter: {
                title: 'filter',
                type: Type.STRING,
                description: 'A regex string to filter compendiums by name (optional).'
            },
        },
        required: ['items', 'actors']
    },
    callTool: async (args: Arguments<string, unknown>) => {
        console.log(`ListCompendiums called with arguments: ${JSON.stringify(args)}`);
        if (!args) {
            return "Failed to list compendiums: no arguments provided.";
        }
        try {
            if (!game || !game.packs) {
                return "Failed to list compendiums: game or game.packs not available.";
            }

            let results = {
                items: [] as {name: string, id: string, label: string}[],
                actors: [] as {name: string, id: string, label: string}[]
            }

            const filter = args.filter as string;
            const regex = filter ? new RegExp(filter, 'i') : null;

            if (args.items) {
                const itemPacks = game.packs.filter(p => p.documentName === "Item");
                for (const itemPack of itemPacks) {
                    if (regex && !regex.test(itemPack.metadata.label)) {
                        continue;
                    }
                    results.items.push({
                        name: itemPack.metadata.label,
                        id: itemPack.metadata.id,
                        label: itemPack.metadata.label
                    });
                }
            }

            if (args.actors) {
                const actorPacks = game.packs.filter(p => p.documentName === "Actor");
                for (const actorPack of actorPacks) {
                    if (regex && !regex.test(actorPack.metadata.label)) {
                        continue;
                    }
                    results.actors.push({
                        name: actorPack.metadata.label,
                        id: actorPack.metadata.id,
                        label: actorPack.metadata.label
                    });
                }
            }
            
            return `Successfully listed compendium(s): ${JSON.stringify(results)}`;
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            return `Failed to list compendiums: ${message}`;
        }
    }
};

export default List;
 
