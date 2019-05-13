import { ClientState, initialState } from '../state/client.state';
import { ClientEventType, ClientActions } from '../actions/client.action';

export function reducer(
  state = initialState,
  action: ClientActions
): ClientState {

  switch (action.type) {

    case ClientEventType.INGAME: {
      return Object.assign({}, state, { inGame: !state.inGame });
    }

    case ClientEventType.UI: {
      return Object.assign({}, state, action.payload );
    }

    case ClientEventType.AUDIO: {
      return Object.assign({}, state, { track: action.payload});
    }

    default: {
      return state;
    }
  }
}

// export const getSocketStatus = (state: ClientState): string => state.socketStatus;
