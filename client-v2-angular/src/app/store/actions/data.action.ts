import { Action } from '@ngrx/store';
import { DataState } from '../state/data.state';
import { Map } from 'src/app/models/data/map.model';
import { Hero, IHero, IStatus } from 'src/app/models/data/hero.model';
import { IEditor, Editor } from 'src/app/models/data/editor.model';

export enum DataEvenType {
    IN = '[Data] Incoming Data',
    OUT = '[Data] Outgoing Data',
    LOGGED = '[Data] Player is Logged In',
    HERODATA = '[Data] Update Hero Data',
    PLAYERSTATUS = '[Data] Player Status Update',
    PLAYERSTATUSINLINE = '[Data] Player Status Inline',
    ROOM = '[Data] Room Update',
    DOORS = '[Data] Doors update',
    SKY = '[Data] Sky Update',
    MAP = '[Data] Map Update',
    EDITOR = '[Data] Editor Request'
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

export class HeroAction implements Action {
    readonly type = DataEvenType.HERODATA;
    constructor(public payload: IHero) { }
}

export class MapAction implements Action {
    readonly type = DataEvenType.MAP;
    constructor(public payload: Map) {}
}

export class SkyAction implements Action {
    readonly type = DataEvenType.SKY;
    constructor(public payload: string) {}
}

export class EditorAction implements Action {
    readonly type = DataEvenType.EDITOR;
    constructor(public payload: Editor){}
}

export class PlayerStatusInlineAction implements Action {
    readonly type = DataEvenType.PLAYERSTATUSINLINE;
    constructor(public payload: IHero) {}
}



export type DataAction
= IncomingData
| OutgoingData
| DoorsAction
| MapAction
| RoomAction
| PlayerStatus
| HeroAction
| SkyAction
| EditorAction
| PlayerStatusInlineAction
;
