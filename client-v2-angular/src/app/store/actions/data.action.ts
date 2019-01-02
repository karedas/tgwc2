import { Action } from '@ngrx/store';
import { DataState } from '../state/data.state';
import { Room } from 'src/app/models/message/room.model';

export enum DataEvenType {
    IN = '[Data] Incoming Data',
    OUT = '[Data] Outgoing Data',
    LOGGEDIN = '[Data] Player is Logged In',
    PLAYERSTATUS = '[Data] Update Player Status',
    ROOM = '[Data] Room',
    MAP = '[Data] Map Update'
}

export class IncomingData implements Action {
    readonly type = DataEvenType.IN;
    constructor(public payload: DataState) {}
}

export class OutgoingData implements Action {
    readonly type = DataEvenType.OUT;
    constructor(public payload: DataState) {}
}

export class RoomAction implements Action {
    readonly type = DataEvenType.ROOM;
    constructor(public payload: any) {}
}

export class PlayerStatus implements Action {
    readonly type = DataEvenType.PLAYERSTATUS;
    constructor( public payload: DataState) {}
}

export class MapAction implements Action {
    readonly type = DataEvenType.MAP;
    constructor(public payload: any) {}

}



export type DataAction
= IncomingData
| OutgoingData
| MapAction
| RoomAction
| PlayerStatus
;
