export enum socketEvent {
    CONNECT = 'connect',
    DISCONNECT = 'disconnect',
    RECONNECT = 'reconnect_attempt',
    CONNECTERROR = 'connect_error',
    PONG = 'pong',
    LOGIN = 'auth',
    DATA = 'data',
    OOB = 'oob',
    REGISTRATION = 'registration',
    REQUESTINVITE = 'requestinvite',
    NEWCHAR = 'newchar',
    READY = 'ready',
    SHUTDOWN = 'shutdown',
    SERVERDOWN = 'serverdown',
    REBOOT = 'reboot',
    ENTERLOGIN = 'enterlogin',
    LOGINOK = 'loginok',
    ERROR = 'error'
}


