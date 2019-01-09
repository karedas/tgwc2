import { SocketState } from '../game.const';
import { User } from 'src/app/models/user/user.model';
import { Character } from 'src/app/models/character/character.model';

export interface ClientState  {
    socketStatus: string;
    isAuthenticated: boolean;
    inGame: boolean;
    errorMessage: string | null;
    time?: string;
    userlevel: number;
    dialog: boolean;
    track?: string;
    musicVolume: number;
    soundVolume: number;
    character: Character;
}

export const initialState: ClientState = {
    socketStatus: SocketState.INITIALIZE,
    isAuthenticated: false,
    inGame: false,
    errorMessage: null,
    time: undefined,
    userlevel: 0,
    dialog: false,
    musicVolume: 70,
    soundVolume: 100,
    character: undefined
};
