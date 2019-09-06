import { Map } from 'src/app/main/client/models/data/map.model';
import { IHero } from 'src/app/main/client/models/data/hero.model';
import { Room } from 'src/app/main/client/models/data/room.model';
import { IEditor } from 'src/app/main/client/models/data/editor.model';
import { IObjPerson } from 'src/app/main/client/models/data/objpers.model';
import { IGenericTable } from 'src/app/main/client/models/data/generictable.model';
import { IWorks } from 'src/app/main/client/models/data/workslist.model';
import { IRegion } from 'src/app/main/client/models/data/region.model';
import { IBook } from 'src/app/main/client/models/data/book.model';
import { IDateTime } from 'src/app/main/client/models/data/dateTime.model';
import { IGenericPage } from 'src/app/main/client/models/data/genericpage.model';

export interface DataState {
    gametime?: IDateTime;
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
    genericpage?: IGenericPage;
    directionNotify: string[]
}

export const initialState: DataState = {
    gametime: undefined,
    base: undefined,
    sky: undefined,
    doors: undefined,
    room: undefined,
    map: undefined,
    hero: {
        equipment: [],
        inventory: []
    },
    editor: undefined,
    objPers: undefined,
    genericTable: undefined,
    workslist: undefined,
    region: undefined,
    book: undefined,
    genericpage: undefined,
    directionNotify: ['']
};

