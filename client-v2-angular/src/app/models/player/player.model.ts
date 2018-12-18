import { Character } from "../character/character.model";

export class Player {
    id?: string;
    username?: string;
    password?: string;
    token?: string;
    command?: string;
    lastCommand?: string;
    status: string;
    // chracter:  Character;
    constructor() {
    }
}

