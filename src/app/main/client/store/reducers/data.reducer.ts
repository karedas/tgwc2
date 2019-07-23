import { initialState } from '../state/data.state';
import {
  incomingData, updateStatusHero, doorsAction, heroAction,
  roomAction, objectAndPersonAction, mapAction, skyAction, editorAction, genericTableAction,
  worksListAction, regionAction, skillsAction, inventoryAction,
  equipAction, bookAction, dataTimeAction, genericPageAction
} from '../actions/data.action';
import { createReducer, on, Action } from '@ngrx/store';

export const dataReducer = createReducer(
  initialState,
  on(mapAction, (state, { payload }) => ({ ...state, map: payload })),
  on(skyAction, (state, { payload }) => ({ ...state, sky: payload })),
  on(editorAction, (state, { payload }) => ({ ...state, editor: payload })),
  on(genericTableAction, (state, { payload }) => ({ ...state, genericTable: payload })),
  on(worksListAction, (state, { payload }) => ({ ...state, workslist: payload })),
  on(regionAction, (state, { payload }) => ({ ...state, region: payload })),
  on(doorsAction, (state, { payload }) => ({ ...state, doors: payload })),
  on(heroAction, (state, { payload }) => ({ ...state, hero: payload })),
  on(roomAction, (state, { payload }) => ({ ...state, room: payload })),
  on(bookAction, (state, { payload }) => ({ book: payload })),
  on(dataTimeAction, (state, { payload }) => ({ date: payload })),
  on(genericPageAction, (state, { payload }) => ({ genericpage: [payload] })),
  on(incomingData, (state, { payload }) => {
    return Object.assign({}, state, { base: [payload] });
  }),
  on(updateStatusHero, (state, { payload }) => ({
    hero: {
      ...state.hero,
      status: {
        drink: payload.drink,
        food: payload.food,
        hit: payload.healt,
        move: payload.move,
        msg: payload.msg
      },
      target: {
        move: payload['enemymove'],
        hit: payload['enemyhealt'],
        icon: payload['enemyicon'],
        name: payload['enemyname']
      },
      combat: payload.combat,
      walk: payload.walk,
      money: payload.money,
      pietoso: payload.pietoso,
      nosfodera: payload.nosfodera
    }
  })),
  on(objectAndPersonAction, (state, { payload }) => {
    return Object.assign({}, { objPers: payload });
  }),
  on(skillsAction, (state, { payload }) => {
    return {
      ...state, hero: {
        ...state.hero,
        skills: payload
      }
    };
  }),
  on(inventoryAction, (state, { payload }) => {
    return {
      ...state, hero: {
        ...state.hero,
        inventory: payload
      }
    };
  }),
  on(equipAction, (state, { payload }) => {
    return {
      ...state, hero: {
        ...state.hero,
        equipment: payload
      }
    };
  })
);


export function reducer(state = initialState, action: Action) {
  return dataReducer(state, action);
}
