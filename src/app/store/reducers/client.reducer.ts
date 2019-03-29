import { ClientState, initialState } from '../state/client.state';
import { ClientEventType, ClientActions } from '../actions/client.action';

export function reducer(
  state = initialState,
  action: ClientActions
): ClientState {

  switch (action.type) {

    // case ClientEventType.INGAME: {
    //   return Object.assign({}, state, { inGame: !state.inGame });
    // }

    default: {
      return state;
    }
  }
}

// export const getSocketStatus = (state: ClientState): string => state.socketStatus;
