import { Action } from '@ngrx/store';

export enum SocketConnectionType {
	INITIALIZE = '[Socket] Initialize',
	CONNECT = '[Socket] Connect',
	DISCONNECT = '[Socket] Disconnect'
};

export enum AuthenticationType {
	DISCONNECT = '[Authentication] User Disconnect',
	LOGIN = '[Authentication] User Login',
	LOGIN_SUCCESS = '[Authentication] User Login Success',
	LOGIN_FAILURE = '[Authentication] User Login Failure'
}

export enum UIType {
	UPDATE = '[UI] Update',
}

/** 
 Connection / Login Actions
*/
export class ConnectAction implements Action {
	readonly type = SocketConnectionType.CONNECT
	constructor(public payload: any) { }
}

export class DisconnectAction implements Action {
	readonly type = SocketConnectionType.DISCONNECT
}

export class LoginAction implements Action {
	readonly type = AuthenticationType.LOGIN;
}

export class LoginSuccessAction implements Action {
	readonly type = AuthenticationType.LOGIN_SUCCESS;
	constructor(public payload: {
		isAuthenticated: boolean;
	}) { }
}

export class LoginFailureAction implements Action {
	readonly type = AuthenticationType.LOGIN_FAILURE;
	constructor(public payload: any) { }
}

/**
 * Client UI Status
 * 
*/
export class UpdateUi implements Action {
	readonly type = UIType.UPDATE
}

// export class UpdateInventory implements Action {

// }

export type GameActions
	= ConnectAction
	| LoginAction
	| LoginSuccessAction
	| LoginFailureAction
	| DisconnectAction
	;
