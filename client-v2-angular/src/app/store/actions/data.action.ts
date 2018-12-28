import { Action } from "@ngrx/store";
import { DataState } from "../state/data.state";
import { GameMode } from "../game.const";

export enum DataEvenType {
    IN = '[Data] Incoming Data',
    OUT = '[Data] Outgoing Data',
    LOGGEDIN = '[Data] Player is Logged In',
    PLAYERSTATUS = '[Data] Update Player Status'
}

export class IncomingData implements Action {
    readonly type = DataEvenType.IN;
    constructor(public payload: DataState) {}
}

export class OutgoingData implements Action {
    readonly type = DataEvenType.OUT;
    constructor(public payload: DataState) {}
}


export class PlayerStatus implements Action {
    readonly type = DataEvenType.PLAYERSTATUS;
    constructor( public payload: DataState){}
}



export type DataAction 
= IncomingData
| OutgoingData
// | PlayerIsLoggedIn
| PlayerStatus
;