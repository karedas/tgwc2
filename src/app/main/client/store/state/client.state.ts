export interface ClientState  {
    time?: Date;
    inGame: boolean;
    isgod: number;
    invLevel: number;
}

export const initialState: ClientState = {
    time: new Date(),
    inGame: false,
    isgod: undefined,
    invLevel: 0,
};
