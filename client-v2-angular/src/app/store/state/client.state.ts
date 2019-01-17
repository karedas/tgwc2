import { SocketState } from '../game.const';

export interface ClientState  {
    socketStatus: string;
    isAuthenticated: boolean;
    reconnect: boolean;
    inGame: boolean;
    errorMessage: string | null;
    time?: string;
    track?: string;
}

export const initialState: ClientState = {
    socketStatus: SocketState.INITIALIZE,
    isAuthenticated: false,
    reconnect: false,
    inGame: false,
    errorMessage: null,
    time: undefined,
};
