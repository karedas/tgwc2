import { Action, createAction, props } from '@ngrx/store';
import { Map } from 'src/app/main/client/models/data/map.model';
import { Editor } from 'src/app/main/client/models/data/editor.model';
import { IObjPerson } from 'src/app/main/client/models/data/objpers.model';
import { IGenericTable } from 'src/app/main/client/models/data/generictable.model';
import { IWorks } from 'src/app/main/client/models/data/workslist.model';
import { IBook } from 'src/app/main/client/models/data/book.model';
import { IDateTime } from 'src/app/main/client/models/data/dateTime.model';
import { IGenericPage } from 'src/app/main/client/models/data/genericpage.model';
import { IHero } from 'src/app/main/client/models/data/hero.model';
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
    GENERICPAGE = '[Data] Generic Page'
}

export const mapAction = createAction(DataEvenType.MAP, props<{map: any}>());
export const incomingData = createAction(DataEvenType.IN, props<{payload: { message: string }}>());
export const updateStatusHero = createAction(DataEvenType.AUTOUPDATESTATUSHERO, props<{payload: any}>());
export const doorsAction = createAction(DataEvenType.DOORS, props<{payload: any}>());
export const roomAction = createAction(DataEvenType.ROOM, props<{payload: any}>());
export const objectAndPersonAction = createAction(DataEvenType.OBJPERSON, props<{payload: IObjPerson}>());
export const heroAction = createAction(DataEvenType.HERODATA, props<{payload: IHero}>());
export const skyAction = createAction(DataEvenType.SKY, props<{payload: string}>());
export const editorAction = createAction(DataEvenType.EDITOR, props<{payload: Editor}>());
export const genericTableAction = createAction(DataEvenType.GENERICTABLE, props<{payload: IGenericTable}>());
export const worksListAction = createAction(DataEvenType.WORKSLIST, props<{payload: IWorks}>());
export const regionAction = createAction(DataEvenType.REGION, props<{payload: { region: IRegion }}>())
export const skillsAction = createAction(DataEvenType.SKILLS, props<{payload: any}>());
export const infoCharacterAction = createAction(DataEvenType.INFO);
export const inventoryAction = createAction(DataEvenType.INVENTORY, props<{payload: any}>());
export const equipAction = createAction( DataEvenType.EQUIP, props<{payload: any}>());
export const bookAction = createAction(DataEvenType.BOOK, props<{payload: IBook}>());
export const dataTimeAction = createAction(DataEvenType.DATE, props<{payload: IDateTime}>());
export const genericPageAction = createAction(DataEvenType.GENERICPAGE, props<{payload: IGenericPage}>());
