import { ClientState } from '../state/client.state';
import { createFeatureSelector, createSelector } from '@ngrx/store';

/******************* Base Search State ******************/
export const getClientState = createFeatureSelector<ClientState>('client');

/*********************** Individual selectors************************** */
function fetchUserLevel(state: ClientState) {
  return state.isgod;
}

function fetchInvisibilityLevel(state: ClientState) {
  return state.invLevel;
}

function fetchAudioTrack(state: ClientState) {
  return state.track;
}

function fetchInGame(state: ClientState) {
  return state.inGame;
}



/******************* Public Selector API's ******************/
export const getInGameStatus = createSelector(getClientState, fetchInGame);
export const getUserLevel = createSelector (getClientState, fetchUserLevel);
export const getInvisibilityLevel = createSelector(getClientState, fetchInvisibilityLevel);
export const getAudioTrack = createSelector(getClientState, fetchAudioTrack);
