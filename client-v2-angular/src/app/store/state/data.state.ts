import { Map } from 'src/app/models/data/map.model';
import { Hero, IHero } from 'src/app/models/data/hero.model';
import { Room } from 'src/app/models/data/room.model';
import { IEditor } from 'src/app/models/data/editor.model';
import { IObjPerson } from 'src/app/models/data/objpers.model';

export interface DataState {
    id: number;
    base: any[];
    sky: string;
    doors?: any;
    room: Room;
    map: Map;
    hero: IHero;
    editor?: IEditor;
    objPers?: IObjPerson;
}

export const initialState: DataState = {
    id: 0,
    base: [''],
    sky: undefined,
    doors: [],
    room: undefined,
    map: undefined,
    hero: new Hero(),
};

