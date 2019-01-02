import { Room } from 'src/app/models/message/room.model';

export interface DataState {
    info: any;
    type: string;
    timestamp: number;
}

export const initialState: DataState = {
    info: '',
    type: 'default',
    timestamp: new Date().getTime()
};
