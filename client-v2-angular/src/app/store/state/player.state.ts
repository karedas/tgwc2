export interface PlayerState {
    name: string;
    race: string;
}

export const initialState: PlayerState = {
    name: undefined,
    race: 'human'
}