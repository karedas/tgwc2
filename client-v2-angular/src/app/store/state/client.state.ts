import { SocketState } from '../game.const';
import { UI } from 'src/app/models/client/ui.model';

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
    soundVolume: 100
}