import { ClientState } from '../state/client.state';
import { createFeatureSelector, createSelector } from '@ngrx/store';

/******************* Base Search State ******************/
export const getClientState = createFeatureSelector<ClientState>('client');

/*********************** Individual selectors************************** */


/******************* Public Selector API's ******************/

export const getErrorMessage  = createSelector(
  getClientState,
  client => client.errorMessage
);

export const getAudioTrack = createSelector(
  getClientState,
  client => client.track
);
