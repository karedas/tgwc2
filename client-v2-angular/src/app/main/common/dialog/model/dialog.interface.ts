export class DialogConfiguration  {
    header?: string;
    width?: any;
    height?: any;
    maxWidth?: any;
    maxHeight?: any;
    modal?: boolean;
    appendTo?: string;
    styleClass?: string;
    data?: any;
    blockScroll?: boolean;
    visible?: boolean;
    resizable?: boolean;
    draggable?: boolean;
    maximizable?: boolean;
    closeOnEscape?: boolean;
    focusOnShow?: boolean;
    contentStyle?: any;
    style?: any;

    constructor() {
        this.width = 'auto',
        this.height = 'auto',
        this.modal = false;
        this.appendTo = 'body';
        this.resizable = false;
        this.draggable = false;
        this.maximizable = false;
        this.closeOnEscape = false;
    }
}

