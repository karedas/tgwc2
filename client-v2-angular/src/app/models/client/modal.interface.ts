export class ModalConfiguration  {
    isModal?: boolean;
    width?: number | string;
    height?: number | string;
    resizable?: boolean;
    showCloseButton?: boolean;

    constructor() {
        this.isModal = true;
        this.width = 550;
        this.height = 'auto';
    }
}

