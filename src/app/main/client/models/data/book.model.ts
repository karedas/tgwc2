  export interface IBookPages {
      title: string;
      text: string;
  }

  export interface IBook {
      desc: string;
      title: string;
      pages: IBookPages[];
  }
