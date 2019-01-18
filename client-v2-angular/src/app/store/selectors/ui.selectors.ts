import { UIState } from "../state/ui.state";
import { createFeatureSelector, createSelector } from "@ngrx/store";


/******************* Base Search State ******************/
export const getUIState = createFeatureSelector<UIState>('ui');

/*********************** Individual selectors************************** */
function fetchUserLevel(state: UIState) {
  return state.isgod;
}

function fetchInvisibilityLevel(state: UIState) {
  return state.invlevel;
}

function fetchWelcomeNews(state: UIState) {
  return state.welcomeNews;
}

/******************* Public Selector API's ******************/
export const getUserLevel = createSelector (getUIState, fetchUserLevel);
export const getInvisibilityLevel = createSelector(getUIState, fetchInvisibilityLevel)
export const getWelcomeNews = createSelector(getUIState, fetchWelcomeNews);
