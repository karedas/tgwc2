export class UI {
    inventory?: boolean;
    equipment?: boolean;
    room?: boolean;

    constructor (){
        this.inventory = false;
        this.equipment = false;
        this.room = false;
        this.map = [];
    }
}