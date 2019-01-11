import { Map } from 'src/app/models/data/map.model';
import { Hero } from 'src/app/models/data/hero.model';
import { Room } from 'src/app/models/data/room.model';

export interface DataState {
    id: number;
    base: any[];
    sky: string;
    doors?: any;
    room: Room;
    map: Map;
    hero: Hero;
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
