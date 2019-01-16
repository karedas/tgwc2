import { UIState } from "../state/ui.state";
import { createFeatureSelector, createSelector } from "@ngrx/store";


/******************* Base Search State ******************/
export const getUIState = createFeatureSelector<UIState>('ui');

/*********************** Individual selectors************************** */

/******************* Public Selector API's ******************/
export const getUserLevel = createSelector (
  getUIState,
  ui => ui.isgod
);

export const getWelcomeNews = createSelector(
  getUIState,
  ui => ui.welcomeNews
);
