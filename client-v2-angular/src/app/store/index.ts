import { ActionReducerMap, createFeatureSelector, createSelector } from "@ngrx/store";
import * as fromClient from './reducers/client.reducer';
import * as fromMessage from './reducers/message.reducer';
import { ClientState } from "./state/client.state";
import { MessageState } from "./state/message.state";
import { PlayerState } from "./state/player.state";

export interface State {
    client: ClientState,
    message: MessageState
    player: PlayerState
}

export const reducers: ActionReducerMap<State> = {
    client: fromClient.reducer,
    message: fromMessage.reducer,
    player: null
}


export const selectClientState = createFeatureSelector<State>('client');
// export const getSocketStatus = createSelector(selectGameState, fromGame.getSocketStatus);