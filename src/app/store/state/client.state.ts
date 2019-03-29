import { SocketState } from '../game.const';

export interface ClientState  {
    time?: Date;
    inGame: boolean;
    isgod: number;
    invLevel: number;
    track: string;
}

export const initialState: ClientState = {
    time: new Date(),
    inGame: false,
    isgod: 0,
    invLevel: 0,
    track: undefined,
};
