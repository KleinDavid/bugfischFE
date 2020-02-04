import { Action } from "./action.model";

export class ServerResult{
    Actions: Action[];
    ActionIds: string[];
    Error: string;
}