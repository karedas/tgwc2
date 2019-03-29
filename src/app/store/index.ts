import { ActionReducerMap } from '@ngrx/store';
import * as fromClient from './reducers/client.reducer';
import { ClientState } from './state/client.state';
import { ClientEventType } from './actions/client.action';

export interface State {
    client: ClientState;
    // data: DataState;
}

export const baseReducer: ActionReducerMap<State> = {
    client: fromClient.reducer,
    // data: fromMessage.reducer,
};


export function clearState(reducer: any) {
    return (state, action) => {
        if (action.type === ClientEventType.RESET) {
            state = undefined;
        }

        return reducer(state, action);
    };
}


