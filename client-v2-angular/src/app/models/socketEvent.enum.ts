export enum socketEvent {
    CONNECT = 'connect',
    DISCONNECT = 'disconnect',
    RECONNECT = 'reconnect_attempt',
    ERROR = 'connect_error',
    PONG = 'pong',
    LOGIN = 'auth',
    READY = 'ready',
    SHUTDOWN = 'shutdown',
    REBOOT = 'reboot',
    DATA = 'data',
    ENTERLOGIN = 'enterlogin',
    LOGINOK = 'loginok',
}
