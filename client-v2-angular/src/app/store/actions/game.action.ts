import { Action } from '@ngrx/store';
import { Player } from 'src/app/models';

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

export class ConnectAction implements Action {
    readonly type = SocketConnectionType.CONNECT
    constructor(public payload: any) {}
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
        // player: Player
    }) {}
}

export class LoginFailureAction implements Action {
    readonly type = AuthenticationType.LOGIN_FAILURE;
    constructor(public payload: any) {}
}

export type GameActions 
    = ConnectAction
    | LoginAction 
    | LoginSuccessAction
    | LoginFailureAction
    | DisconnectAction
    ;
