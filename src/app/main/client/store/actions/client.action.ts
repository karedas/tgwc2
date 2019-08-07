import { createAction, props } from '@ngrx/store';

export enum ClientEventType {
  DISCONNECT = '[Client] User Disconnect',
  INGAME = '[Client] User In Game',
  RESET = '[Client] Reset for New Login',
  UI = '[Client] Ui Updated',
  NEWS = '[Client] Show News',
  AUDIO = '[Client] Audio',
  UPDATENEEDED = '[Client] Update Needed Data',
}


export const disconnectAction = createAction(ClientEventType.DISCONNECT);
export const inGameAction = createAction(ClientEventType.INGAME);
export const resetAction = createAction(ClientEventType.RESET);
export const newsAction = createAction(ClientEventType.NEWS);
export const updateUIAction = createAction(ClientEventType.UI, props<{payload: any}>());
export const audioAction = createAction(ClientEventType.AUDIO, props<{payload: string}>());
export const updateNeededAction = createAction(ClientEventType.UPDATENEEDED, props<{payload: any}>());
