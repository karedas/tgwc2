import { ActionReducerMap, createFeatureSelector, createSelector } from "@ngrx/store";
import * as fromClient from './reducers/client.reducer';
import * as fromMessage from './reducers/data.reducer';
import { ClientState } from "./state/client.state";
import { DataState } from "./state/data.state";

export interface State {
    client: ClientState,
    data: DataState
}

export const reducers: ActionReducerMap<State> = {
    client: fromClient.reducer,
    data: fromMessage.reducer,
}


export const selectClientState = createFeatureSelector<State>('client');
// export const getSocketStatus = createSelector(selectGameState, fromGame.getSocketStatus);