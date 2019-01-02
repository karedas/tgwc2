import { Room } from 'src/app/models/message/room.model';

export interface DataState {
    default: any;
    room: any;
    lastType: string;
    timestamp: number;
}

export const initialState: DataState = {
    default: '',
    room: undefined,
    lastType: 'default',
    timestamp: new Date().getTime()
};
