import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UIState } from '../state/ui.state';


/******************* Base Search State ******************/
export const getUIState = createFeatureSelector<UIState>('ui');

/*********************** Individual selectors************************** */
function fetchUserLevel(state: UIState) {
  return state.isgod;
}

function fetchInvisibilityLevel(state: UIState) {
  return state.invLevel;
}

function fetchWelcomeNews(state: UIState) {
  return state.welcomeNews;
}

function fetchDashboardVisibility(state: UIState) {
  return state.showDashBoard;
}

function fetchExtraOutput(state: UIState) {
  return state.extraOutput;
}

function fetchAudioTrack(state: UIState) {
  return state.track;
}

/******************* Public Selector API's ******************/
export const getUserLevel = createSelector (getUIState, fetchUserLevel);
export const getInvisibilityLevel = createSelector(getUIState, fetchInvisibilityLevel);
export const getWelcomeNews = createSelector(getUIState, fetchWelcomeNews);
export const getAudioTrack = createSelector(getUIState, fetchAudioTrack);
