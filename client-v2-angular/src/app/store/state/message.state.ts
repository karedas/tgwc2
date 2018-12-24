
export interface MessageState {
    id: number;
    data: any;
    cmd: undefined;
    timestamp: number;
    type: string;
}

export const initialState: MessageState = {
    id: undefined,
    data: undefined,
    cmd: undefined,
    timestamp: undefined,
    type: undefined
}