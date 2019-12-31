export enum socketEvent {
    CONNECT = 'connect',
    DISCONNECT = 'disconnect',
    RECONNECT = 'reconnect_attempt',
    CONNECTERROR = 'connect_error',
    PONG = 'pong',
    AUTH = 'auth',
    LOGIN = 'login',
    DATA = 'data',
    OOB = 'oob',
    REGISTRATION = 'registration',
    REQUESTINVITE = 'requestinvite',
    NEWCHAR = 'newchar',
    READY = 'ready',
    LOGINREQUEST = 'loginrequest',
    ENTERLOGIN = 'enterlogin',
    LOGINOK = 'loginok',
    ERROR = 'error',
    SHUTDOWN = 'shutdown',
    SERVERDOWN = 'serverdown',
    REBOOT = 'reboot'
}


