import { SocketState } from '../game.const';

export interface ClientState  {
    time?: Date;
}

export const initialState: ClientState = {
    time: new Date(),
};
