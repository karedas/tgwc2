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
      return {...state, hero: { ...state.hero,
        status: {
          drink: action.payload[3],
          food: action.payload[2],
          hit: action.payload[0],
          move: action.payload[1],
        },
        target: {
          move: action.payload[5],
          hit: action.payload[4],
          icon: action.payload[6],
          name: action.payload[7]
        }
      }};

    case DataEvenType.HERODATA:
      return {...state, hero: action.payload};

    case DataEvenType.DOORS:
      return Object.assign({}, state, {
        doors: action.payload,
      });
    case DataEvenType.ROOM:
      return Object.assign({}, state, {
        room: action.payload,
      });

    case DataEvenType.OBJPERSON:
      return Object.assign({}, state, {
        objPers: action.payload
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
      });
    case DataEvenType.PLAYERSTATUSINLINE:
      return {...state, hero: action.payload};

    case DataEvenType.GENERICTABLE:
      return Object.assign({}, state, {
        genericTable: action.payload}
      )

    default:
      return state;
  }
}
