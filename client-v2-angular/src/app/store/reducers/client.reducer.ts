import { ClientState, initialState } from "../state/client.state";
import { GameActions, SocketConnectionType, AuthenticationType } from "../actions/client.action";


export function reducer(
	state = initialState,
	action: GameActions
): ClientState {

	switch (action.type) {

		case SocketConnectionType.CONNECT: {
			return Object.assign({}, state, { socketStatus: action.payload })
		}

		case SocketConnectionType.DISCONNECT: {
			return initialState;
		}

		case AuthenticationType.LOGIN_SUCCESS: {
			return Object.assign({}, state, action.payload)
		}

		default: {
			return state;
		}
	}
}

export const getSocketStatus = (state: ClientState): string => state.socketStatus;

// export const getUserLoginSuccess = ( state: GameState ) => state.isAuthenticated;