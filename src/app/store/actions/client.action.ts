import { Action } from '@ngrx/store';

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

export class DisconnectAction implements Action {
  readonly type = ClientEventType.DISCONNECT;
}

export class InGameAction implements Action {
  readonly type = ClientEventType.INGAME;
}

export class UpdateUI implements Action {
  readonly type = ClientEventType.UI;
  constructor(public payload: any) {}
}


export class ResetAction implements Action {
  readonly type = ClientEventType.RESET;
}


export class AudioAction implements Action {
  readonly type = ClientEventType.AUDIO;
  constructor(public payload: string) {}
}

export class NewsAction implements Action {
  readonly type =  ClientEventType.NEWS;
}

export class CloseTextEditor implements Action {
  readonly type = ClientEventType.CLOSETEXTEDITOR;
}

export class ShowCommandsActions implements Action {
  readonly type = ClientEventType.SHOWCOMMANDS;
  constructor( public payload: []) {}
}

export class ShowCharacterSheetActions implements Action {
  readonly type = ClientEventType.SHOWCHARACTERSHEET;
  constructor (public payload: any) {}
}

export class UpdateNeeded implements Action {
  readonly type = ClientEventType.UPDATENEEDED;
  constructor( public payload: any) {}
}

export class RefreshCommandAction implements Action {
    readonly type = ClientEventType.REFRESH;
}

export class ShowStatusBoxAction implements Action {
  readonly type = ClientEventType.SHOWSTATUSHERO;
  constructor( public payload: any) {}
}


export type ClientActions
  = InGameAction
  | DisconnectAction
  | ResetAction
  | UpdateUI
  | AudioAction
  | CloseTextEditor
  | NewsAction
  | ShowCommandsActions
  | ShowStatusBoxAction
  | UpdateNeeded;
