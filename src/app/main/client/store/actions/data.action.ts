import { createAction, props } from '@ngrx/store';
import { Editor } from 'src/app/main/client/models/data/editor.model';
import { IObjPerson } from 'src/app/main/client/models/data/objpers.model';
import { IGenericTable } from 'src/app/main/client/models/data/generictable.model';
import { IWorks } from 'src/app/main/client/models/data/workslist.model';
import { IBook } from 'src/app/main/client/models/data/book.model';
import { IDateTime } from 'src/app/main/client/models/data/dateTime.model';
import { IGenericPage } from 'src/app/main/client/models/data/genericpage.model';
import { IRegion } from 'src/app/main/client/models/data/region.model';


export enum DataEvenType {
    IN = '[Data] Incoming Data',
    OUT = '[Data] Outgoing Data',
    LOGGED = '[Data] Player is Logged In',
    HERODATA = '[Data] Update Hero Data',
    AUTOUPDATESTATUSHERO = '[Data] Auto Update Hero Status',
    ROOM = '[Data] Room Update',
    DOORS = '[Data] Doors update',
    SKY = '[Data] Sky Update',
    MAP = '[Data] Map Update',
    EDITOR = '[Data] Editor Request',
    OBJPERSON = '[Data] Object or Person',
    GENERICTABLE = '[Data] Generic Table',
    WORKSLIST = '[Data] Works List',
    REGION = '[Data] Region',
    INFO = '[Data] Info Character',
    SKILLS = '[Data] Skills List',
    INVENTORY = '[Data] Inventory',
    EQUIP = '[Data] Equip',
    BOOK = '[Data] Book',
    DATE = '[Data] Date Time',
    GENERICPAGE = '[Data] Generic Page',
    CLOSETEXTEDITOR = '[Data] Close Text Editor',
    SHOWCOMMANDS = '[Data] Show Commands List',
    SHOWCHARACTERSHEET = '[Data] Show Character Sheet',
    SHOWSTATUSHERO = '[Data] Show Status Hero Inline',
    REFRESH = '[Client] Refresh server command',
    DIRECTION = '[Client] Character Direction'
}

export const mapAction = createAction(DataEvenType.MAP, props<{ map: any }>());
export const incomingData = createAction(DataEvenType.IN, props<{ payload: { message: string } }>());
export const updateStatusHero = createAction(DataEvenType.AUTOUPDATESTATUSHERO, props<{ payload: any }>());
export const doorsAction = createAction(DataEvenType.DOORS, props<{ payload: any }>());
export const roomAction = createAction(DataEvenType.ROOM, props<{ payload: any }>());
export const objectAndPersonAction = createAction(DataEvenType.OBJPERSON, props<{ payload: IObjPerson }>());
export const heroAction = createAction(DataEvenType.HERODATA, props<{ payload: any }>());
export const skyAction = createAction(DataEvenType.SKY, props<{ payload: string }>());
export const editorAction = createAction(DataEvenType.EDITOR, props<{ payload: Editor }>());
export const genericTableAction = createAction(DataEvenType.GENERICTABLE, props<{ payload: IGenericTable }>());
export const worksListAction = createAction(DataEvenType.WORKSLIST, props<{ payload: IWorks }>());
export const regionAction = createAction(DataEvenType.REGION, props<{ payload: IRegion }>());
export const skillsAction = createAction(DataEvenType.SKILLS, props<{ payload: any, dialog?: boolean }>());
export const infoCharacterAction = createAction(DataEvenType.INFO);
export const inventoryAction = createAction(DataEvenType.INVENTORY, props<{ payload: any, dialog?: boolean }>());
export const equipAction = createAction(DataEvenType.EQUIP, props<{ payload: any, dialog?: boolean }>());
export const bookAction = createAction(DataEvenType.BOOK, props<{ book: IBook }>());
export const dataTimeAction = createAction(DataEvenType.DATE, props<{ payload: IDateTime }>());
export const genericPageAction = createAction(DataEvenType.GENERICPAGE, props<{ genericpage: IGenericPage }>());
export const closeTextEditorAction = createAction(DataEvenType.CLOSETEXTEDITOR);
export const refreshCommandAction = createAction(DataEvenType.REFRESH);
export const showCommandsActions = createAction(DataEvenType.SHOWCOMMANDS, props<{payload: any}>());
export const showCharacterSheetActions = createAction(DataEvenType.SHOWCHARACTERSHEET, props<{payload: any}>());
export const showStatusBoxAction = createAction(DataEvenType.SHOWSTATUSHERO, props<{payload: any}>());
export const directionNotifyAction = createAction(DataEvenType.DIRECTION, props<{payload: any}>())
