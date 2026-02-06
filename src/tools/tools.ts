import RollDiceTool from "./rolldice";
import CreateNPCTool from "./createnpc";
import UpdateNPCTool from "./updatenpc";

import { FunctionTool } from "./types";

const Tools: FunctionTool[] = [
    RollDiceTool,
    CreateNPCTool,
    UpdateNPCTool
];

export default Tools;
