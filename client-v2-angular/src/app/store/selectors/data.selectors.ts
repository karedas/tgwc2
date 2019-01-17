import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DataState } from '../state/data.state';
import { Room } from 'src/app/models/data/room.model';
import { MPersons } from 'src/app/main/client/output/renders/details-room/models/persons.model';
import { IHero } from 'src/app/models/data/hero.model';

/******************* Base Search State ******************/
export const getDataState = createFeatureSelector<DataState>('data');


/*********************** Individual selectors************************** */
export const selectDataBase = (state: DataState) => state.base;
export const selectDataRoom = (state: DataState) => state.room;
export const selectDataHero = (state: DataState) => state.hero;

/******************* Public Selector API's ******************/

export const getId = createSelector(
  getDataState,
  (data: DataState) => data.id
);

export const getDataBase = createSelector(
  getDataState,
  (data: DataState) => data.base
);

export const getHero = createSelector(
  getDataState,
  data => data.hero 
)

/* Hero Selectors */
export const getStatus = createSelector(
  getHero,
  data => data.status
);

/* Generics Selectors */
export const getRoomBase = createSelector(
  getDataState,
  (data: DataState) => data.room
);

export const getObjectsInRoom = createSelector(
  getRoomBase,
  (room:Room) => room.objcont.list
)

export const getPersonsInRoom = createSelector(
  getRoomBase,
  (room:Room) => room.perscont.list
)

export const getDoors = createSelector(
  getDataState,
  (data: DataState) => data.doors
);

export const getSky = createSelector(
  getDataState,
  (data: DataState)  => data.sky
);

export const getMap = createSelector(
  getDataState,
  data => data.map
);
