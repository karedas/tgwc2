import { GameState, initialState } from "../state/game.state";
import { GameActions, SocketConnectionType, AuthenticationType } from "../actions/game.action";


export function reducer(
    state = initialState,
    action: GameActions 
    ): GameState  {
    
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

export const getSocketStatus = (state: GameState): string => state.socketStatus;

// export const getUserLoginSuccess = ( state: GameState ) => state.isAuthenticated;



