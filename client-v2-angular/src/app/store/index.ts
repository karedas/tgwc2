import { ActionReducerMap, createFeatureSelector, createSelector } from "@ngrx/store";
import * as fromClient from './reducers/client.reducer';
import * as fromMessage from './reducers/message.reducer';
import { ClientState } from "./state/client.state";
import { MessageState } from "./state/message.state";
import { from } from "rxjs";

export interface State {
    clientState: ClientState,
    message: MessageState
}

export const reducers: ActionReducerMap<State> = {
    clientState: fromClient.reducer,
    message: fromMessage.reducer
}


export const selectGameState = createFeatureSelector<State>('game');

// export const getSocketStatus = createSelector(selectGameState, fromGame.getSocketStatus);