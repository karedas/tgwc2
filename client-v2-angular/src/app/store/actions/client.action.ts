import { Action } from '@ngrx/store';

export enum UIType {
	UPDATE = '[UI] Update',
}


export enum ClientEventType {
	INITIALIZE = '[Authentication] Socket Initialize',
	CONNECT = '[Authentication] Socket Connect',
	DISCONNECT = '[Authentication] User Disconnect',
	LOGIN = '[Authentication] User Login',
	LOGIN_SUCCESS = '[Authentication] User Login Success',
	LOGIN_FAILURE = '[Authentication] User Login Failure'
}

export class SocketStatusAction implements Action {
	readonly type = ClientEventType.CONNECT;
	constructor(public payload: string) {}
}

export class LoginAction implements Action {
	readonly type = ClientEventType.LOGIN;
}

export class DisconnectAction implements Action {
	readonly type = ClientEventType.DISCONNECT
}

export class LoginSuccessAction implements Action {
	readonly type = ClientEventType.LOGIN_SUCCESS;
}

export class LoginFailureAction implements Action {
	readonly type = ClientEventType.LOGIN_FAILURE;
	constructor(public payload: any) { }
}


export class UpdateUi implements Action {
	readonly type = UIType.UPDATE
}

// export class UpdateInventory implements Action {

// }

export type ClientActions
	= UpdateUi
	| SocketStatusAction
	| LoginAction
	| DisconnectAction
	| LoginSuccessAction
	| LoginFailureAction
	;
