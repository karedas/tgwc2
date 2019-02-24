export interface IWorksList {
  diff: string;
  cando: boolean;
  icon: number;
  desc: string;
}

export interface IWorks {
  cmd: string;
  verb: string;
  list: IWorksList;
}
