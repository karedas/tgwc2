import { createAction, props } from '@ngrx/store';

export enum ClientEventType {
  DISCONNECT = '[Client] User Disconnect',
  INGAME = '[Client] User InGame Status action',
  RESET = '[Client] Reset Store',
  UI = '[Client] Ui Updated',
  UPLOADAVATAR = '[Client] Upload Avatar'
}

export const disconnectAction = createAction(ClientEventType.DISCONNECT);
export const inGameAction = createAction(ClientEventType.INGAME, props<{payload: boolean}>());
export const resetAction = createAction(ClientEventType.RESET);
export const updateUIAction = createAction(ClientEventType.UI, props<{payload: any}>());
export const uploadAvatarAction = createAction(ClientEventType.UPLOADAVATAR);
