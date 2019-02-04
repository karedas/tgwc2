export class DialogConfiguration  {
    header?: string;
    width?: any;
    height?: any;
    maxWidth?: any;
    maxHeight?: any;
    modal?: boolean;
    appendTo?: string;
    styleClass?: string;
    blockScroll?: boolean;

    constructor() {
        this.modal = false;
        this.appendTo = 'body';
    }
}

