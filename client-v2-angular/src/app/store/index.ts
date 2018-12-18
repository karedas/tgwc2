import { ActionReducerMap, createFeatureSelector, createSelector } from "@ngrx/store";
import * as fromGame from './reducers/game.reducer';
import { GameState } from "./state/game.state";

export interface State {
    game: GameState
}

export const reducers: ActionReducerMap<State> = {
    game: fromGame.reducer
}


export const selectGameState = createFeatureSelector<State>('game');

// export const getSocketStatus = createSelector(selectGameState, fromGame.getSocketStatus);