import { initialState } from '../state/data.state';
import * as DataAction from '../actions/data.action';
import { createReducer, on, Action } from '@ngrx/store';

export const reducer = createReducer(
  initialState,
  on(DataAction.heroAction,  (state, { payload }) => {
    return Object.assign({}, state, {
      hero: {
        ...state.hero,
        ...payload
      }});
  }),
  on(DataAction.mapAction, (state, { map }) => ({ ...state, map: map })),
  on(DataAction.skyAction, (state, { payload }) => ({ ...state, sky: payload })),
  on(DataAction.editorAction, (state, { payload }) => ({ ...state, editor: payload })),
  on(DataAction.genericTableAction, (state, { payload }) => ({ ...state, genericTable: payload })),
  on(DataAction.worksListAction, (state, { payload }) => ({ ...state, workslist: payload })),
  on(DataAction.regionAction, (state, { payload }) => ({ ...state, region: payload })),
  on(DataAction.doorsAction, (state, { payload }) => ({ ...state, doors: payload })),
  on(DataAction.roomAction, (state, { payload }) => ({ ...state, room: payload })),
  on(DataAction.bookAction, (state, { payload }) => ({ ...state, book: payload })),
  on(DataAction.dataTimeAction, (state, { payload }) => ({ ...state, gametime: payload })),
  on(DataAction.genericPageAction, (state, { genericpage }) => ({ ...state,  genericpage: [genericpage] })),
  on(DataAction.incomingData, (state, { payload }) => {
    return Object.assign({}, state, { base: [payload] });
  }),
  on(DataAction.updateStatusHero, (state, { payload }) => {
    return Object.assign({}, state, {
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
    });
  }),
  on(DataAction.objectAndPersonAction, (state, { payload }) => {
    return Object.assign({}, { objPers: payload });
  }),
  on(DataAction.skillsAction, (state, { payload }) => {
    return Object.assign({}, state, {
      hero: {
        ...state.hero,
        skills: payload
      }
    });
  }),
  on(DataAction.inventoryAction, (state, { payload }) => {
    return Object.assign({}, state, {
      hero: {
        ...state.hero,
        inventory: payload
      },
    });
  }),
  on(DataAction.equipAction, (state, { payload }) => {
    return Object.assign({}, state, {
      hero: {
        ...state.hero,
        equipment: payload
      }
    });
  })
);


export function dataReducer(state = initialState, action: Action) {
  return reducer(state, action);
}
