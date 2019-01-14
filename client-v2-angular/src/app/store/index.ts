import { ActionReducerMap } from '@ngrx/store';
import * as fromClient from './reducers/client.reducer';
import * as fromMessage from './reducers/data.reducer';
import * as fromUi from './reducers/ui.reducer';
import { ClientState } from './state/client.state';
import { DataState } from './state/data.state';
import { UIState } from './state/ui.state';

export interface State {
    client: ClientState;
    ui: UIState;
    data: DataState;
}

export const reducers: ActionReducerMap<State> = {
    client: fromClient.reducer,
    ui: fromUi.reducer,
    data: fromMessage.reducer,
};
