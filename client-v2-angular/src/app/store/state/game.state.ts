import { Player } from '../../models';
import { SocketState } from '../game.const';

export interface GameState {
    socketStatus: string;
    isAuthenticated: boolean;
    player?: Player | null;
    errorMessage: string | null;
    time?: string;
    
}

export const initialState: GameState = {
    socketStatus: SocketState.INITIALIZE,
    isAuthenticated: false,
    errorMessage: null,
    time: undefined,
    player: undefined
}