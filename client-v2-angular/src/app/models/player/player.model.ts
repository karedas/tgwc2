import { Character } from "../character/character.model";

export class Player extends Character{
    id?: number;
    username: string;
    password: string;
    email?: number;
    command?: string;
    lastCommand?: string;
    status?: string;
}

