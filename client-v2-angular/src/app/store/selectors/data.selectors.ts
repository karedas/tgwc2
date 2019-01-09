import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DataState } from '../state/data.state';

/******************* Base Search State ******************/
export const getDataState = createFeatureSelector<DataState>('data');


/*********************** Individual selectors************************** */
export const selectDataBase = (state: DataState) => state.base;
export const selectDataRoom = (state: DataState) => state.room;

/******************* Public Selector API's ******************/

export const getId = createSelector(
  getDataState,
  (data: DataState) => data.id
);

export const getDataBase = createSelector(
  getDataState,
  (data: DataState) => data.base
);

/* Hero Selectors */ 
export const getStatus = createSelector(
  getDataState,
  (data: DataState) => data.hero.status
);

/* Generics Selectors */
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