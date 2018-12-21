import { Action } from "@ngrx/store";
import { MessageState } from "../state/message.state";

export enum MessageEventType {
    IN = '[Message] Incoming Data Message',
    OUT = '[Message] Outgoing Data Message',
    LOGGEDIN = '[Message] Player is Logged In'
}

export class IncomingMessage implements Action {
    readonly type = MessageEventType.IN;
    constructor(public payload: MessageState) {}
}

export class OutgoingMessage implements Action {
    readonly type = MessageEventType.OUT;
    constructor(public payload: MessageState) {}
}

export class PlayerIsLoggedIn implements Action {
    readonly type = MessageEventType.LOGGEDIN
}


export type MessageAction 
= IncomingMessage
| OutgoingMessage
| PlayerIsLoggedIn
;