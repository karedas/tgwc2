import { ActionReducerMap } from '@ngrx/store';
import * as fromClient from './reducers/client.reducer';
import * as fromData from './reducers/data.reducer';
import { ClientState } from './state/client.state';
import { ClientEventType } from './actions/client.action';
import { DataState } from './state/data.state';

export interface WebClientState {
    client: ClientState;
    data: DataState;
}

export const baseReducer: ActionReducerMap<WebClientState> = {
    client: fromClient.reducer,
    data: fromData.reducer,
};

export function clearState(reducer: any) {
    return (state, action) => {
        if (action.type === ClientEventType.RESET) {
            state = undefined;
        }

        return reducer(state, action);
    };
}


