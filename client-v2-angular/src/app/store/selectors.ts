import { createFeatureSelector, createSelector } from "@ngrx/store";
import { DataState } from "./state/data.state";

export const getDataState = createFeatureSelector<DataState>('data');

export const getData = createSelector(
    getDataState,
    data => data,
  );