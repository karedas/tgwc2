import { initialState, ClientState } from '../state/client.state';
import { inGameAction, updateUIAction } from '../actions/client.action';
import { Action, on, createReducer } from '@ngrx/store';

export const reducer = createReducer(
  initialState,
  on(inGameAction, (state, { payload }) => ({ ...state, inGame: payload })),
  on(updateUIAction, (state, { payload }) => {
    return Object.assign({}, state, payload);
  }),
);

export function clientReducer(state: ClientState | undefined, action: Action) {
  return reducer(state, action);
}
