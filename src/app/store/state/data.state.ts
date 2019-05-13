import { Map } from 'src/app/models/data/map.model';
import { IHero } from 'src/app/models/data/hero.model';
import { Room } from 'src/app/models/data/room.model';
import { IEditor } from 'src/app/models/data/editor.model';
import { IObjPerson } from 'src/app/models/data/objpers.model';
import { IGenericTable } from 'src/app/models/data/generictable.model';
import { IWorks } from 'src/app/models/data/workslist.model';
import { IRegion } from 'src/app/models/data/region.model';
import { IBook } from 'src/app/models/data/book.model';
import { IDateTime } from 'src/app/models/data/dateTime.model';
import { IGenericPage } from 'src/app/models/data/genericpage.model';

export interface DataState {
    date?: IDateTime;
    base?: any[];
    sky?: string;
    doors?: any;
    room?: Room;
    map?: Map;
    hero?: IHero;
    editor?: IEditor;
    objPers?: IObjPerson;
    genericTable?: IGenericTable;
    workslist?: IWorks;
    region?: IRegion;
    book?: IBook;
    genericpage?: IGenericPage[];
}

export const initialState: DataState = {
    date: undefined,
    base: undefined,
    sky: undefined,
    doors: undefined,
    room: undefined,
    map: undefined,
    hero: undefined,
    editor: undefined,
    objPers: undefined,
    genericTable: undefined,
    workslist: undefined,
    region: undefined,
    book: undefined,
    genericpage: undefined
};

