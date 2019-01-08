import { ClientState, initialState } from '../state/client.state';
import { ClientEventType, ClientActions } from '../actions/client.action';

export function reducer(
	state = initialState,
	action: ClientActions
): ClientState {

	switch (action.type) {


		case ClientEventType.CONNECT: {
			return Object.assign( {}, state, { socketStatus: action.payload });
		}
		case ClientEventType.LOGIN_SUCCESS: {
			return Object.assign( {}, state, { isAuthenticated: action.payload });
		}
		case ClientEventType.LOGIN_FAILURE: {
			return { ...state, errorMessage: action.payload };
		}
		case ClientEventType.DISCONNECT: {
			return initialState;
		}

		case ClientEventType.INGAME: {
			return Object.assign({}, state, { ingame: !state.inGame });
		}
		default: {
			return state;
		}
	}
}

export const getSocketStatus = (state: ClientState): string => state.socketStatus;
