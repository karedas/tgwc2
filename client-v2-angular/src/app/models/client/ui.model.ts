


export class UI {
    musicVolume: number;
    soundVolume: number;
    inventory: {
        version: number;
        needed: boolean;
    };
    equipment: {
        version: number;
        needed: boolean;
    };
    room: {
        version: number;
        needed: boolean;
    };
    cursorOnMap: false; // Remove?
    editorIsopen: boolean;


    constructor() {
        this.musicVolume = 100;
        this.soundVolume = 70;
        this.inventory = {
            version: -1,
            needed: false
        };
        this.equipment = {
            version: -1,
            needed: false
        };
        this.room = {
            version: -1,
            needed: false
        };
        this.cursorOnMap = false;
        this.editorIsopen = false;
    }
}
