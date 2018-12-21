import { initialState, MessageState } from "../state/message.state";
import { MessageAction, MessageEventType } from "../actions/message.action";

export function reducer(
	state = initialState,
	action: MessageAction
): MessageState {
    switch (action.type) {
        case MessageEventType.IN: 
            return Object.assign({}, state, {message: action.payload})
        break;
        case MessageEventType.OUT: 
            return Object.assign({}, state, {message: action.payload})
        break;
        default:
            return state;
    }
}
