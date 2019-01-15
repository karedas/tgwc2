import { Action } from "@ngrx/store";

export enum UIEventType {
  AUDIO = '[UI] Audio',
  UI = '[UI] Ui Updated',
  WELCOMENEWS = '[UI] Welcome News',
  TOGGLEOUTPUT = '[UI] Toggle Extra Output',
  TOGGLEDASHBOARD = '[UI] Toggle Dashboard'
}

export class ToggleExtraOutput implements Action {
  readonly type = UIEventType.TOGGLEOUTPUT;
}

export class ToggleDashboard implements Action {
  readonly type = UIEventType.TOGGLEDASHBOARD;
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

export type UIActions
  = ToggleExtraOutput
  | ToggleDashboard
  | UpdateUI
  | AudioAction
  | WelcomeNewsAction;