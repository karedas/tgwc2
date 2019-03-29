import { ClientState } from '../state/client.state';
import { createFeatureSelector, createSelector } from '@ngrx/store';

/******************* Base Search State ******************/
export const getClientState = createFeatureSelector<ClientState>('client');

/*********************** Individual selectors************************** */
// function fetchErrorMessage(state: ClientState) {
//   return state.errorMessage;
// }

// function fetchAuthentication(state: ClientState) {
//   return state.isAuthenticated;
// }

// function fetchInGame(state: ClientState) {
//   return state.inGame;
// }



/******************* Public Selector API's ******************/
// export const getErrorMessage  = createSelector(getClientState, fetchErrorMessage);
// export const getAuthenticatedState = createSelector(getClientState, fetchAuthentication);
// export const getInGameStatus = createSelector(getClientState, fetchInGame);
