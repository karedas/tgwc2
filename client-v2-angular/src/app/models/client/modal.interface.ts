export class ModalConfiguration  {
    isModal?: boolean;
    width?: number | string;
    height?: number | string;
    resizable?: boolean;
    showCloseButton?: boolean;
    modalOpacity?: number;

    constructor() {
        this.isModal = true;
        this.width = 550;
        this.height = 'auto';
        this.modalOpacity = 0.3;
    }
}

