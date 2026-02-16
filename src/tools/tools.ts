import CreateActor from "./actors/create";
import UpdateActor from "./actors/update";
import ListActors from "./actors/list";

import GetCompendium from "./compendiums/get";
import ListCompendiums from "./compendiums/list";

import RollTool from "./dice/roll";

import ListFolders from "./folders/list";

import CreateItem from "./items/create";
import UpdateItem from "./items/update";
import ListItems from "./items/list";

import GetJournal from "./journals/get";
import ListJournals from "./journals/list";


import { FunctionTool } from "./types";

const Tools: FunctionTool[] = [
    CreateActor,
    UpdateActor,
    ListActors,
    GetCompendium,
    ListCompendiums,
    RollTool,
    ListFolders,
    CreateItem,
    UpdateItem,
    ListItems,
    GetJournal,
    ListJournals
];

export default Tools;
