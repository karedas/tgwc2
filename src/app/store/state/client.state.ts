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
    inGame: undefined,
    isgod: undefined,
    invLevel: undefined,
    track: undefined,
};
