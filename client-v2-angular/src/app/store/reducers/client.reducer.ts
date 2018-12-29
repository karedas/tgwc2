import { ClientState, initialState } from "../state/client.state";
import { ClientEventType } from "../actions/client.action";


export function reducer(
	state = initialState,
	action: ClientAction
): ClientState {

	switch (action.type) {


		case ClientEventType.CONNECT: {
			return Object.assign({}, state, { socketStatus: action.payload });
		}

		case ClientEventType.LOGIN_FAILURE: {
			return { ...state, errorMessage: action.payload};
		}

		default: {
			return state;
		}
	}
}

export const getSocketStatus = (state: ClientState): string => state.socketStatus;

// export const getUserLoginSuccess = ( state: GameState ) => state.isAuthenticated;