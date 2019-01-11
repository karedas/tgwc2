import { Action } from '@ngrx/store';
import { DataState } from '../state/data.state';
import { Map } from 'src/app/models/data/map.model';
import { Hero } from 'src/app/models/data/hero.model';

export enum DataEvenType {
    IN = '[Data] Incoming Data',
    OUT = '[Data] Outgoing Data',
    LOGGED = '[Data] Player is Logged In',
    PLAYERSTATUS = '[Data] Player Status Update',
    ROOM = '[Data] Room Update',
    DOORS = '[Data] Doors update',
    SKY = '[Data] Sky Update',
    MAP = '[Data] Map Update'
}

export class IncomingData implements Action {
    readonly type = DataEvenType.IN;
    constructor(public payload: string) {}
}
export class OutgoingData implements Action {
    readonly type = DataEvenType.OUT;
    constructor(public payload: string) {}
}

export class LoggedAction implements Action {
    readonly type = DataEvenType.LOGGED;
    constructor(public payload: any) {}
}
export class DoorsAction implements Action {
    readonly type = DataEvenType.DOORS;
    constructor( public payload: any) {}
}

export class RoomAction implements Action {
    readonly type = DataEvenType.ROOM;
    constructor(public payload: any) {}
}

export class PlayerStatus implements Action {
    readonly type = DataEvenType.PLAYERSTATUS;
    constructor( public payload: any) {}
}

export class MapAction implements Action {
    readonly type = DataEvenType.MAP;
    constructor(public payload: Map) {}
}

export class SkyAction implements Action {
    readonly type = DataEvenType.SKY;
    constructor(public payload: string) {}
}



export type DataAction
= IncomingData
| OutgoingData
| DoorsAction
| MapAction
| RoomAction
| PlayerStatus
| SkyAction
;
