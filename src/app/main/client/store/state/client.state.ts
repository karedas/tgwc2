export interface ClientState  {
    time?: Date;
    inGame: boolean;
    isgod: number;
    invLevel: number;
    audio: string;
}

export const initialState: ClientState = {
    time: new Date(),
    inGame: false,
    isgod: undefined,
    invLevel: 0,
    audio: undefined,
};
