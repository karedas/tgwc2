export interface IEditor {
    maxChars: any;
    title: string;
    description: string;
}

  export class Editor implements IEditor {
    maxChars: any;
    title: string;
    description: string;
    constructor(...args: any) {}
  }
