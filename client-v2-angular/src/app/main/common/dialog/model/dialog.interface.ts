export class DialogConfiguration  {
    header?: string;
    width?: any;
    height?: any;
    maxWidth?: any;
    maxHeight?: any;
    modal?: boolean;
    appendTo?: string;

    constructor() {
        this.modal = false;
        this.appendTo = 'body';
    }
}

