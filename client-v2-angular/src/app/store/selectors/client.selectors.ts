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


export const getAuthenticatedState = createSelector(
  getClientState,
  client  => { 
    if(client.reconnect && client.isAuthenticated) {
     return {auth: true, reconnect: true}
    }
    else if (!client.reconnect && client.isAuthenticated) {
      return {auth: true, reconnect: false}
    }
    else {
      return {auth: false, reconnect: false}
    }
  }
);
