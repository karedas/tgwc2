export enum socketEvent {
    CONNECT = 'connect',
    DISCONNECT = 'disconnect',
    RECONNECT = 'reconnect_attempt',
    ERROR = 'connect_error',
    PONG = 'pong',
    LOGIN = 'auth',
    DATA = 'data',
    OOB = 'oob'
}
