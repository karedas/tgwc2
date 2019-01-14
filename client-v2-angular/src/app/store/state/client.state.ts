import { SocketState } from '../game.const';

export interface ClientState  {
    socketStatus: string;
    isAuthenticated: boolean;
    inGame: boolean;
    errorMessage: string | null;
    time?: string;
    userlevel: number;
    track?: string;
}

export const initialState: ClientState = {
    socketStatus: SocketState.INITIALIZE,
    isAuthenticated: false,
    inGame: false,
    errorMessage: null,
    time: undefined,
    userlevel: 0,
};
