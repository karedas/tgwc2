import { SocketState } from '../game.const';
import { UI } from 'src/app/models/client/ui.model';

export interface ClientState  {
    socketStatus: string;
    isAuthenticated: boolean;
    inGame: boolean;
    errorMessage: string | null;
    time?: string;
    userlevel: number;
    track?: string;
    ui: UI;
}

export const initialState: ClientState = {
    socketStatus: SocketState.INITIALIZE,
    isAuthenticated: false,
    inGame: false,
    errorMessage: null,
    time: undefined,
    userlevel: 0,
    ui: new UI()
};
