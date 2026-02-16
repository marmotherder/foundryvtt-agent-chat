import { Arguments, FunctionTool, Type } from "../types";

const ListJournals: FunctionTool = {
    name: 'ListJournals',
    description: `Retrieve journal entries from the current Foundry game. This can overload the context window, in this case, don't retrieve the content, and get the specific journal entry directly with the GetJournal tool.`,
    parameters: {
        title: 'content',
        type: Type.BOOLEAN,
        description: 'Should the full contents of the journals be retrieved?'
    },
    callTool: async (args: Arguments<string, unknown>) => {
        console.log(`ListJournals called with arguments: ${JSON.stringify(args)}`);
        try {
            const content = args['content'] as boolean;

            if (!game || !game.journal) {
                return "Failed to list journals: game or game.journal not available.";
            }

            if (content) {
                return `Successfully listed journals: ${JSON.stringify(game.journal)}`;
            }

            let journals = [];
            for (const journal of game.journal) {
                let pages = [];
                for (const page of journal.pages.values()) {
                    pages.push(page.name);
                }

                journals.push({
                    _id: journal._id,
                    _source: journal._source,
                    _stats: journal._stats,
                    apps: journal.apps,
                    folder: journal.folder,
                    name: journal.name,
                    ownership: journal.ownership,
                    sort: journal.sort,
                    pages: pages
                });
            }

            return `Successfully listed journals: ${JSON.stringify(journals)}`;
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            return `Failed to list journals: ${message}`;
        }
    }
};

export default ListJournals;
