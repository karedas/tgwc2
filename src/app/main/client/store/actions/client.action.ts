import { createAction, props } from '@ngrx/store';

export enum ClientEventType {
  DISCONNECT = '[Client] User Disconnect',
  INGAME = '[Client] User In Game',
  RESET = '[Client] Reset for New Login',
  UI = '[Client] Ui Updated',
  NEWS = '[Client] Show News',
  SHOWCOMMANDS = '[Client] Show Commands List',
  SHOWSTATUSHERO = '[Client] Show Status Hero Inline',
  SHOWCHARACTERSHEET = '[Client] Show Character Sheet',
  AUDIO = '[Client] Audio',
  UPDATENEEDED = '[Client] Update Needed Data',
  CLOSETEXTEDITOR = '[Client] Close Text Editor',
  REFRESH = '[Client] Refresh server command'
}


export const disconnectAction = createAction(ClientEventType.DISCONNECT);
export const inGameAction = createAction(ClientEventType.INGAME);
export const resetAction = createAction(ClientEventType.RESET);
export const newsAction = createAction(ClientEventType.NEWS);
export const closeTextEditorAction = createAction(ClientEventType.CLOSETEXTEDITOR);
export const refreshCommandAction = createAction(ClientEventType.REFRESH);
export const updateUIAction = createAction(ClientEventType.UI, props<{payload: any}>());
export const audioAction = createAction(ClientEventType.AUDIO, props<{payload: string}>());
export const showCommandsActions = createAction(ClientEventType.SHOWCOMMANDS, props<{payload: []}>());
export const showCharacterSheetActions = createAction(ClientEventType.SHOWCHARACTERSHEET, props<{payload: any}>());
export const updateNeededAction = createAction(ClientEventType.UPDATENEEDED, props<{payload: any}>());
export const showStatusBoxAction = createAction(ClientEventType.SHOWSTATUSHERO, props<{payload: any}>());