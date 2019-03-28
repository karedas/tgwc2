import { Action } from '@ngrx/store';

export enum UIEventType {
  UI = '[UI] Ui Updated',
  AUDIO = '[UI] Audio',
  WELCOMENEWS = '[UI] Welcome News',
  UPDATENEEDED = '[UI] Update Needed Data',
  CLOSETEXTEDITOR = '[UI] Close Text Editor',
  SHOWCOMMANDS = '[UI] Show Commands List',
  SHOWSTATUSHERO = '[UI] Show Status Hero Inline',
  SHOWCHARACTERSHEET = '[UI] Show Character Sheet',
  REFRESH = '[UI] Refresh server command'

}

export class UpdateUI implements Action {
  readonly type = UIEventType.UI;
  constructor(public payload: any) {}
}


export class AudioAction implements Action {
  readonly type = UIEventType.AUDIO;
  constructor(public payload: string) {}
}

export class WelcomeNewsAction implements Action {
  readonly type =  UIEventType.WELCOMENEWS;
}

export class CloseTextEditor implements Action {
  readonly type = UIEventType.CLOSETEXTEDITOR;
}

export class ShowCommandsActions implements Action {
  readonly type = UIEventType.SHOWCOMMANDS;
  constructor( public payload: []) {}
}

export class ShowCharacterSheetActions implements Action {
  readonly type = UIEventType.SHOWCHARACTERSHEET;
  constructor (public payload: any) {}
}


export class UpdateNeeded implements Action {
  readonly type = UIEventType.UPDATENEEDED;
  constructor( public payload: any) {}
}

export class RefreshCommandAction implements Action {
    readonly type = UIEventType.REFRESH;
}

export class ShowStatusBoxAction implements Action {
  readonly type = UIEventType.SHOWSTATUSHERO;
  constructor( public payload: any) {}
}

export type UIActions   =
  | UpdateUI
  | UpdateUI
  | AudioAction
  | CloseTextEditor
  | ShowCommandsActions
  | ShowStatusBoxAction
  | UpdateNeeded;
