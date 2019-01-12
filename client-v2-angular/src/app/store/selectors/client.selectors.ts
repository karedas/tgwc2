import { ClientState } from '../state/client.state';
import { createFeatureSelector, createSelector } from '@ngrx/store';


export const getClientState = createFeatureSelector<ClientState>('client');

// CLIENT SELECTORS
export const getUserLevel = createSelector (
  getClientState,
  client => client.userlevel
);

export const getErrorMessage  = createSelector(
  getClientState,
  client => client.errorMessage
);

export const getAudioTrack = createSelector(
  getClientState,
  client => client.track
);

export const getWelcomeNews = createSelector(
  getClientState,
  client => client.ui.welcomeNews
);


export const getUI = createSelector(
  getClientState,
  client => client.ui
)
