import { UIActions, UIEventType } from "../actions/ui.action";
import { UIState, initialState} from "../state/ui.state";

export function reducer(
  state = initialState,
  action: UIActions
): UIState {
  switch (action.type) {

    
    case UIEventType.AUDIO: {
      return Object.assign({}, state, { track: action.payload});
    }
    
    case UIEventType.WELCOMENEWS: {
      return Object.assign({}, state, { welcomeNews: action.payload})
    }

    case UIEventType.TOGGLEOUTPUT: {
      return Object.assign({}, state, { extraOutput: !state.extraOutput})
    }
    case UIEventType.UI: {
      return Object.assign({}, state, action.payload);
    }

    default:
      return state;
  }
}