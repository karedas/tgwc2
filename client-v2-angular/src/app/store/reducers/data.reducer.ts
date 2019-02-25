import { initialState, DataState } from '../state/data.state';
import { DataAction, DataEvenType } from '../actions/data.action';

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

    case DataEvenType.AUTOUPDATESTATUSHERO:
      return Object.assign({}, state, {hero: {
        ...state.hero,
        status: {
          drink: action.payload.drink,
          food: action.payload.food,
          hit: action.payload.healt,
          move: action.payload.move
        },
        target: {
          move: action.payload['enemymove'],
          hit: action.payload['enemyhealt'],
          icon: action.payload['enemyicon'],
          name: action.payload['enemyname']
        },
        conva: action.payload.conva,
        combat: action.payload.combat,
        position: action.payload.position,
        walk: action.payload.walk,
        money: action.payload.money,
        pietoso: action.payload.pietoso,
        nosfodera: action.payload.nosfodera
      }}
      );

    case DataEvenType.HERODATA:
      const hero = Object.assign({}, state.hero, action.payload);
      return Object.assign({}, state, {hero: hero});

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

    case DataEvenType.GENERICTABLE:
      return Object.assign({}, state, {
        genericTable: action.payload}
      );

    case DataEvenType.WORKSLIST:
      return Object.assign({}, state, {
        workslist: action.payload
      });

    case DataEvenType.REGION:
      return Object.assign({}, state, {
        region: action.payload
      });

    case DataEvenType.SKILLS:
      return {...state, hero: { ...state.hero,
        skills: action.payload
      }};

    case DataEvenType.INVENTORY:
      return {...state, hero: { ...state.hero,
      inventory: action.payload
      }};

    case DataEvenType.EQUIP:
      return {...state, hero: { ...state.hero,
      equipment: action.payload
    }};

    case DataEvenType.BOOK:
      return Object.assign({}, state, {
      book: action.payload
    });

    case DataEvenType.DATE:
      return Object.assign({}, state, {
        date: action.payload
      });

    case DataEvenType.GENERICPAGE:
      return Object.assign({}, state, {
        genericpage: action.payload
      });

    default:
      return state;
  }
}
