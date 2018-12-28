import { initialState, DataState } from "../state/data.state";
import { DataAction, DataEvenType } from "../actions/data.action";

export function reducer(
	state = initialState,
	action: DataAction
): DataState {
    switch (action.type) {
        case DataEvenType.IN: 
            return Object.assign({}, state, action.payload)
        case DataEvenType.OUT: 
            return Object.assign({}, state, action.payload)
        case DataEvenType.PLAYERSTATUS: 
            return Object.assign({}, state, action.payload)    
        default:
            return state;
    }
}
