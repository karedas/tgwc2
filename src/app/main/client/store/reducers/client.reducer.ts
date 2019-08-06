import { initialState, ClientState } from '../state/client.state';
import { inGameAction, updateUIAction, audioAction } from '../actions/client.action';
import { Action, on, createReducer } from '@ngrx/store';

export const reducer = createReducer(
  initialState,
  on(inGameAction, state => ({
      ...state,
      inGame: true
    })
  ),
  on(updateUIAction, (state, { payload }) => ({
    ...state,
    updateUI: payload
  })),
  on(audioAction, (state, { payload })  => ({ ...state, audio: payload}))
);


export function clientReducer(state: ClientState | undefined, action: Action) {
  return reducer(state, action);
}
