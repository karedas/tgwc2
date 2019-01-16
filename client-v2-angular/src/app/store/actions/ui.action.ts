import { Action } from "@ngrx/store";

export enum UIEventType {
  UI = '[UI] Ui Updated',
  AUDIO = '[UI] Audio',
  WELCOMENEWS = '[UI] Welcome News',
  TOGGLEOUTPUT = '[UI] Toggle Extra Output',
  TOGGLEDASHBOARD = '[UI] Toggle Dashboard',
  UPDATENEEDED = '[UI] Update Needed Data',
}

export class UpdateUI implements Action {
  readonly type = UIEventType.UI;
  constructor(public payload: any) {}
}

export class ToggleExtraOutput implements Action {
  readonly type = UIEventType.TOGGLEOUTPUT;
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
  | WelcomeNewsAction;