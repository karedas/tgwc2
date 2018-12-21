
export interface MessageState {
    id: number;
    data: any;
    timestamp: number;
    type: string;
}

export const initialState: MessageState = {
    id: undefined,
    data: undefined,
    timestamp: undefined,
    type: undefined
}