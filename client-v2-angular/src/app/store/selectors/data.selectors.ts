import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DataState } from '../state/data.state';

/******************* Base Search State ******************/
export const getDataState = createFeatureSelector<DataState>('data');


/*********************** Individual selectors************************** */
export const selectDataBase = (state: DataState) => state.base;
export const selectDataRoom = (state: DataState) => state.room;
export const selectDataHero = (state: DataState) => state.hero;

function fetchDataId(state: DataState) {
  return state.id;
}

function fetchDataBase(state: DataState) {
  return state.base;
}

function fetchHero(state: DataState) {
  return state.hero;
}

function fetchRoom(state: DataState) {
  return state.room;
}

function fetchObjOrPerson(state: DataState) {
  return state.objPers;
}

function fetchObjectsInRoom(state: DataState) {
  return state.room.objcont.list;
}

function fetchPersonsInRoom(state: DataState) {
  return state.room.perscont.list;
}

function fetchDoors(state: DataState) {
  return state.doors;
}

function fetchSky(state: DataState) {
  return state.sky;
}

function feetchMap(state: DataState) {
  return state.map;
}

function fetchEditor(state: DataState) {
  return state.editor;
}

/******************* Public API's ******************/
export const getId = createSelector(getDataState, fetchDataId);
export const getDataBase = createSelector(getDataState, fetchDataBase);
export const getHero = createSelector(getDataState, fetchHero);
export const getRoomBase = createSelector(getDataState, fetchRoom);
export const getObjOrPerson = createSelector(getDataState, fetchObjOrPerson);
export const getObjectsInRoom = createSelector(getDataState , fetchObjectsInRoom);
export const getPersonsInRoom = createSelector(getDataState, fetchPersonsInRoom);
export const getDoors = createSelector(getDataState, fetchDoors);
export const getSky = createSelector(getDataState, fetchSky);
export const getMap = createSelector(getDataState, feetchMap);
export const getEditor = createSelector(getDataState, fetchEditor);


