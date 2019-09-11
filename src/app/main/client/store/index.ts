import { ActionReducerMap, createFeatureSelector, MetaReducer, ActionReducer } from '@ngrx/store';
import * as fromClient from './reducers/client.reducer';
import * as fromData from './reducers/data.reducer';
import { ClientState } from './state/client.state';
import { ClientEventType } from './actions/client.action';
import { DataState } from './state/data.state';


export interface TGState {
  client: ClientState;
  data: DataState;
}

export interface State {
  TG: TGState;
}

export const baseReducer: ActionReducerMap<TGState> = {
  client: fromClient.clientReducer,
  data: fromData.dataReducer,
};

export const selectTGState = createFeatureSelector<TGState>('TG');


export function clearState(reducer: ActionReducer<any>): ActionReducer<any> {
  return function(state, action) {
    if (action.type === ClientEventType.RESET) {
      state = {
        client: undefined,
        data: undefined
      };
    }
    return reducer(state, action);
  };
}

export const metaReducers: MetaReducer<any>[] = [clearState];



