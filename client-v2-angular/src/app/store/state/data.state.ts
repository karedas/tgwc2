import { Map } from 'src/app/models/data/map.model';
import { IHero } from 'src/app/models/data/hero.model';
import { Room } from 'src/app/models/data/room.model';
import { IEditor } from 'src/app/models/data/editor.model';
import { IObjPerson } from 'src/app/models/data/objpers.model';
import { IGenericTable } from 'src/app/models/data/generictable.model';
import { IWorks } from 'src/app/models/data/workslist.model';
import { IRegion } from 'src/app/models/data/region.model';
import { IBook } from 'src/app/models/data/book.model';

export interface DataState {
    date: number;
    base: any[];
    sky: string;
    doors?: any;
    room: Room;
    map: Map;
    hero?: IHero;
    editor?: IEditor;
    objPers?: IObjPerson;
    genericTable?: IGenericTable;
    workslist?: IWorks;
    region?: IRegion;
    book?: IBook
}

export const initialState: DataState = {
    date: Date.now(),
    base: [''],
    sky: undefined,
    doors: [],
    room: undefined,
    editor: undefined,
    map: undefined,
    hero: undefined,
};

