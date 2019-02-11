import { Action } from '@ngrx/store';
import { Map } from 'src/app/models/data/map.model';
import { IHero } from 'src/app/models/data/hero.model';
import { Editor } from 'src/app/models/data/editor.model';
import { IObjPerson } from 'src/app/models/data/objpers.model';
import { IGenericTable } from 'src/app/models/data/generictable.model';
import { IWorks } from 'src/app/models/data/workslist.model';
import { IRegion } from 'src/app/models/data/region.model';

export enum DataEvenType {
    IN = '[Data] Incoming Data',
    OUT = '[Data] Outgoing Data',
    LOGGED = '[Data] Player is Logged In',
    HERODATA = '[Data] Update Hero Data',
    AUTOUPDATESTATUSHERO = '[Data] Auto Update Hero Status',
    PLAYERSTATUSINLINE = '[Data] Player Status Inline',
    ROOM = '[Data] Room Update',
    DOORS = '[Data] Doors update',
    SKY = '[Data] Sky Update',
    MAP = '[Data] Map Update',
    EDITOR = '[Data] Editor Request',
    OBJPERSON = '[Data] Object or Person',
    GENERICTABLE = '[Data] Generic Table',
    WORKSLIST = '[Data] Works List',
    REGION = '[Data] Region',
    SKILLS = '[Data] Skills List'
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

export class ObjAndPersAction implements Action {
    readonly type = DataEvenType.OBJPERSON;
    constructor(public payload: IObjPerson) {}
}

export class UpdateStatusHero implements Action {
    readonly type = DataEvenType.AUTOUPDATESTATUSHERO;
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
    constructor(public payload: Editor) {}
}

export class PlayerStatusInlineAction implements Action {
    readonly type = DataEvenType.PLAYERSTATUSINLINE;
    constructor(public payload: any[]) {}
}

export class GenericTableAction implements Action {
    readonly type = DataEvenType.GENERICTABLE;
    constructor(public payload: IGenericTable) {}
}

export class WorksListAction implements Action {
    readonly type = DataEvenType.WORKSLIST;
    constructor(public payload: IWorks) {}
}

export class RegionAction implements Action {
    readonly type = DataEvenType.REGION;
    constructor(public payload: IRegion) {}
}

export class SkillsAction implements Action {
    readonly type = DataEvenType.SKILLS; 
    constructor(public payload: any) {}
}

export type DataAction
= IncomingData
| OutgoingData
| DoorsAction
| MapAction
| RoomAction
| UpdateStatusHero
| HeroAction
| SkyAction
| EditorAction
| PlayerStatusInlineAction
| ObjAndPersAction
| GenericTableAction
| WorksListAction
| SkillsAction
| RegionAction;

