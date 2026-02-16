import { Arguments, FunctionTool, Type } from "../types";

const Get: FunctionTool = {
    name: 'GetJournal',
    description: `This tool gets the entries of a journal based on the journal ID.
    Journal IDs based on their entry types can be found using the ListJournals tool.`,
    parameters: {
        title: 'id',
        type: Type.STRING,
        description: 'The ID of the journal to get.',
    },
    callTool: async (args: Arguments<string, unknown>) => {
        console.log(`GetJournal called with arguments: ${JSON.stringify(args)}`);
        if (!args) {
            return "Failed to get journal: no arguments provided.";
        }
        try {
            if (!game || !game.journal) {
                return "Failed to get journal: game or game.journal not available.";
            }

            const journal = game.journal.find(j => j._id === args.id);
            if (!journal) {
                return `Failed to get journal: no journal found with id ${args.id}`;
            }

            return `Successfully got journal: ${JSON.stringify(journal)}`;
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            return `Failed to get journal: ${message}`;
        }
    }
};

export default Get;
 
