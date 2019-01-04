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
// export const getHistory = createSelector(
//   selectDataBase, 
//   selectDataRoom
// );
export const getDataBase = createSelector(
  getDataState,
  (data: DataState) => data.base
)

export const getRoomBase = createSelector(
  getDataState,
  (data: DataState) => data.room
)




// export const getDataDefault = createSelector(
//   getDataState,
//   data => data.default
// )

// export const getRoom = createSelector(
//   getDataState,
//   data => data.default
// )

export const getMap = createSelector(
  getDataState,
  data => data.map
)


// export const getHistory = createSelector(
//   selecDefault,
//   selectRoom
// )

// CLIENT SELECTORS
export const getUserLevel = createSelector (
  getClientState,
  client => client.userlevel
)

export const getErrorMessage  = createSelector(
  getClientState,
  client => client.errorMessage
)
