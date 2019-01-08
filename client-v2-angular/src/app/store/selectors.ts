import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DataState } from './state/data.state';
import { ClientState } from './state/client.state';

/******************* Base Search State ******************/
export const getDataState = createFeatureSelector<DataState>('data');
export const getClientState = createFeatureSelector<ClientState>('client');


/*********************** Individual selectors************************** */
export const selectDataBase = (state: DataState) => state.base;
export const selectDataRoom = (state: DataState) => state.room;

/******************* Public Selector API's ******************/

export const getDataBase = createSelector(
  getDataState,
  (data: DataState) => data.base
);

export const getRoomBase = createSelector(
  getDataState,
  (data: DataState) => data.room
);

export const getDoors = createSelector(
  getDataState,
  (data:DataState) => data.doors
)

export const getSky = createSelector(
  getDataState,
  (data:DataState)  => data.sky
);

export const getMap = createSelector(
  getDataState,
  data => data.map
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
