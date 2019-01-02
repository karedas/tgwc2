import { IUser } from './user.interface';

export class User implements IUser {
    name: string;
    state: string;
    action?: string;
    direction?: string;
    speed: number;

    constructor(name) {
        this.name = name;
        this.state = 'active';
        this.speed = 2;
    }
}

