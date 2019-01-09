import { Action } from '@ngrx/store';

export enum UIType {
	UPDATE = '[UI] Update',
}


export enum ClientEventType {
	INITIALIZE = '[Client] Socket Initialize',
	CONNECT = '[Client] Socket Connect',
	DISCONNECT = '[Client] User Disconnect',
	LOGIN = '[Client] User Login',
	LOGIN_SUCCESS = '[Client] User Login Success',
	LOGIN_FAILURE = '[Client] User Login Failure',
	INGAME = '[Client] User In Game',
	AUDIO = '[Client] Audio',
}

export class SocketStatusAction implements Action {
	readonly type = ClientEventType.CONNECT;
	constructor(public payload: string) {}
}

export class LoginAction implements Action {
	readonly type = ClientEventType.LOGIN;
}

export class DisconnectAction implements Action {
	readonly type = ClientEventType.DISCONNECT;
}

export class LoginSuccessAction implements Action {
	readonly type = ClientEventType.LOGIN_SUCCESS;
	constructor( public payload: boolean) {}
}

export class LoginFailureAction implements Action {
	readonly type = ClientEventType.LOGIN_FAILURE;
	constructor(public payload: any) { }
}

export class InGameAction implements Action  {
	readonly type = ClientEventType.INGAME;
}

export class AudioAction implements Action {
	readonly type = ClientEventType.AUDIO;
	constructor(public payload: string) {}
}

export class UpdateUi implements Action {
	readonly type = UIType.UPDATE;
}

// export class UpdateInventory implements Action {

// }

export type ClientActions
	= UpdateUi
	| InGameAction
	| SocketStatusAction
	| LoginAction
	| DisconnectAction
	| LoginSuccessAction
	| LoginFailureAction
	| AudioAction
	;
