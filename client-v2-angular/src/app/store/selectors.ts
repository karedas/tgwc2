import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DataState } from './state/data.state';
import { ClientState } from './state/client.state';

export const getDataState = createFeatureSelector<DataState>('data');
export const getClientState = createFeatureSelector<ClientState>('client');


// DATA SELECTORS
export const getData = createSelector(
    getDataState,
    data => data,
  );

export const getDataDefault = createSelector(
  getDataState,
  data => data.default
)

export const getRoom = createSelector(
  getDataState,
  data => data.default
)

export const getMap = createSelector(
  getDataState,
  data => data.map
)

export const selecDefault = (state: DataState) => state.default;
export const selectRoom = (state: DataState) => state.room;

export const getHistory = createSelector(
  selecDefault,
  selectRoom
)

// CLIENT SELECTORS
export const getUserLevel = createSelector (
  getClientState,
  client => client.userlevel
)

export const getErrorMessage  = createSelector(
  getClientState,
  client => client.errorMessage
)
