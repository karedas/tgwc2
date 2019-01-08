import { Map } from "src/app/models/data/map.model";
import { Hero } from "src/app/models/data/hero.model";
import { Room } from "src/app/models/data/room.model";

export interface DataState {
    base: any;
    sky: string;
    doors?: any;
		room: Room;
		map: Map
		hero: Hero
    lastType: string;
		timestamp: number;
}

export const initialState: DataState = {
    base: '',
    sky: undefined,
    doors: [],
		room: undefined,
		map: undefined,
		hero: new Hero(),
    lastType: 'base',
    timestamp: new Date().getTime(),
};
