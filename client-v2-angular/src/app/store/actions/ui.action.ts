import { Action } from '@ngrx/store';
import { IHero } from 'src/app/models/data/hero.model';

export enum UIEventType {
  UI = '[UI] Ui Updated',
  AUDIO = '[UI] Audio',
  WELCOMENEWS = '[UI] Welcome News',
  TOGGLEOUTPUT = '[UI] Toggle Extra Output',
  TOGGLEDASHBOARD = '[UI] Toggle Dashboard',
  UPDATENEEDED = '[UI] Update Needed Data',
  CLOSETEXTEDITOR = '[UI] Close Text Editor',
  SHOWCOMMANDS = '[UI] Show Commands List',
  SHOWCHARACTERSHEET = '[UI] Show Character Sheet'

}

export class UpdateUI implements Action {
  readonly type = UIEventType.UI;
  constructor(public payload: any) {}
}

export class ToggleExtraOutput implements Action {
  readonly type = UIEventType.TOGGLEOUTPUT;
  constructor(public payload: boolean | null) {} 
}

export class ToggleDashboard implements Action {
  readonly type = UIEventType.TOGGLEDASHBOARD;
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
  constructor (public payload: IHero) {}
}


export class UpdateNeeded implements Action {
  readonly type = UIEventType.UPDATENEEDED;
  constructor( public payload: any) {}
}


export type UIActions
  =
  | UpdateUI
  | ToggleExtraOutput
  | ToggleDashboard
  | UpdateUI
  | AudioAction
  | WelcomeNewsAction
  | CloseTextEditor
  | ShowCommandsActions
  | UpdateNeeded;
