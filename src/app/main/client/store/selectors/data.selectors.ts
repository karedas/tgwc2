import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DataState } from '../state/data.state';
import { selectTGState, TGState } from '..';



/******************* Base Search State ******************/
export const getDataState = createSelector(selectTGState, (state) => state.data);

/*********************** Individual selectors************************** */
export const selectDataBase = (state: DataState) => state.base;
export const selectDataRoom = (state: DataState) => state.room;
export const selectDataHero = (state: DataState) => state.hero;


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

function fetchGenericTable(state: DataState) {
  return state.genericTable;
}

function fetchWorksList(state: DataState) {
  return state.workslist;
}

function fetchRegion(state: DataState) {
  return state.region;
}

function fetchSkills(state: DataState) {
  return state.hero.skills;
}

function fetchEquip(state: DataState) {
  return state.hero.equipment;
}

function fetchInventory(state: DataState) {
  return state.hero.inventory;
}


function fetchDateTime(state: DataState) {
  return state.gametime;
}

function fetchGenericPage(state: DataState) {
  return state.genericpage;
}

/******************* Public API's ******************/
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
export const getGenericTable = createSelector(getDataState, fetchGenericTable);
export const getWorksList = createSelector(getDataState, fetchWorksList);
export const getRegion = createSelector(getDataState, fetchRegion);
export const getSkills = createSelector(getDataState, fetchSkills);
export const getEquip = createSelector(getDataState, fetchEquip);
export const getInventory = createSelector(getDataState, fetchInventory);
export const getDateTime = createSelector(getDataState, fetchDateTime);
export const getGenericPage = createSelector(getDataState, fetchGenericPage);
