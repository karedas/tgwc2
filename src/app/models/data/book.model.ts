  export interface IBookPages {
      title: string;
      text: string;
  }

  export interface IBook {
      descr: string;
      title: string;
      pages: IBookPages[];
  }
