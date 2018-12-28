import { SocketState } from '../game.const';
import { User } from 'src/app/models/user/user.model';

export interface ClientState  {
    socketStatus: string;
    isAuthenticated: boolean;
    errorMessage: string | null;
    time?: string;
    dialog: boolean
    musicVolume: number,
    soundVolume: number,
}

export const initialState: ClientState = {
    socketStatus: SocketState.INITIALIZE,
    isAuthenticated: false,
    errorMessage: null,
    time: undefined,
    dialog: false,
    musicVolume: 70,
    soundVolume: 100,
}