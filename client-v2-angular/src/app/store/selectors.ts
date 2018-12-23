import { createFeatureSelector, createSelector } from "@ngrx/store";
import { MessageState } from "./state/message.state";

export const getMessageState = createFeatureSelector<MessageState>('message');

export const getMessage = createSelector(
    getMessageState,
    message => message.data,
  );