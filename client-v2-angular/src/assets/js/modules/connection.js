import { clog } from 'utility';
import io from 'socket.io-client';

export class Connection {
    constructor () {
        this.ws_server_addr = 'http://51.38.185.84:3335';
        this.socket_io_resource = 'socket.io';
        this.is_active = false;
        this.netdata = '';
        this.socket_connection = {
            'reconnection': true,
            'autoConnect:': true,
            'forceNew': true,
            'resource': this.socket_io_resource,
            'transports': ['websocket'],
            'reconnectionDelay': 1500,
            'reconnectionAttempts': 'Infinity'
        }

        this.socket = null;
    }

    connect() {
       this.resetSocket();
       return this.socket = io.connect(
            this.ws_server_addr, 
            this.socket_connection
        ); 
    }

    resetSocket() {
        if (this.socket) {
            this.socket.destroy();
            delete this.socket;
            this.socket = null;
        }
    }

    get address () {
        return this.ws_server_addr
    }

    set address (addr) {
        this.ws_server_addr = addr
    }

    get status () {
        return this.is_active;
    }

    set status(status) {
        this.is_active = status;
    }
}