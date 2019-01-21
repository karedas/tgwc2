import { initialState, DataState } from '../state/data.state';
import { DataAction, DataEvenType } from '../actions/data.action';
import { Hero } from 'src/app/models/data/hero.model';

export function reducer(
  state = initialState,
  action: DataAction
): DataState {
  switch (action.type) {
    case DataEvenType.IN:
      return Object.assign({}, state, {
        base: [action.payload]
      });
    case DataEvenType.OUT:
      return Object.assign({}, state, action.payload);
    case DataEvenType.PLAYERSTATUS:
      // return Object.assign({}, state, {hero: {status: action.payload}});
      return {...state, hero: { ...state.hero, status: action.payload}}
    
    case DataEvenType.HERODATA:
      return {...state, hero: action.payload}

    case DataEvenType.DOORS:
      return Object.assign({}, state, {
        doors: action.payload,
      });
    case DataEvenType.ROOM:
      return Object.assign({}, state, {
        room: action.payload,
      });
    case DataEvenType.MAP:
      return Object.assign({}, state, {
        map: action.payload,
      });
    case DataEvenType.SKY:
      return Object.assign({}, state, {
        sky: action.payload,
      });

    case DataEvenType.EDITOR:
      return Object.assign({}, state, {
        editor: action.payload
      })

    default:
      return state;
  }
}
