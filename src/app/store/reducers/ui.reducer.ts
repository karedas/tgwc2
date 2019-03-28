import { UIActions, UIEventType } from '../actions/ui.action';
import { UIState, initialState} from '../state/ui.state';

export function reducer(
  state = initialState,
  action: UIActions
): UIState {
  switch (action.type) {

    case UIEventType.UI: {
      return Object.assign({}, state, action.payload );
    }

    case UIEventType.AUDIO: {
      return Object.assign({}, state, { track: action.payload});
    }


    // case UIEventType.TOGGLEOUTPUT: {
    //   let newState = action.payload;
    //   if (typeof action.payload !== 'boolean' ) {
    //     newState = !state.extraOutput;
    //   }
    //   return Object.assign({}, state, { extraOutput: newState});
    // }

    case UIEventType.UI: {
      return Object.assign({}, state, action.payload);
    }

    default:
      return state;
  }
}
