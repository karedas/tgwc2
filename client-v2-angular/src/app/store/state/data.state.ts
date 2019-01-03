import { Map } from "src/app/models/data/map.model";
import { Hero } from "src/app/models/data/hero.model";

export interface DataState {
    default: any;
    sky: any;
		room: any;
		map: Map
		hero: Hero
    lastType: string;
		timestamp: number;
}

export const initialState: DataState = {
    default: '',
    sky: undefined,
		room: undefined,
		map: undefined,
		hero: new Hero(),
    lastType: 'default',
    timestamp: new Date().getTime(),
};
