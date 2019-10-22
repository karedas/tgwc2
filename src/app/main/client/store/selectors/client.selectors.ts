import { ClientState } from '../state/client.state';
import { createSelector } from '@ngrx/store';
import { selectTGState } from '..';

/******************* Base Search State ******************/
export const getClientState = createSelector(selectTGState, (state) => state.client);

/*********************** Individual selectors************************** */
function fetchUserLevel(state: ClientState) {
  return state.isgod;
}

function fetchInvisibilityLevel(state: ClientState) {
  return state.invLevel;
}

function fetchInGame(state: ClientState) {
  return state.inGame;
}



/******************* Public Selector API's ******************/
export const getInGameStatus = createSelector(getClientState, fetchInGame);
export const getUserLevel = createSelector (getClientState, fetchUserLevel);
export const getInvisibilityLevel = createSelector(getClientState, fetchInvisibilityLevel);
