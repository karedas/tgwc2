export interface Desc {
  base: string;
  repeatlast: boolean;
}

export interface List {
  type: string;
  icon: number;
  cond: number;
  condprc: number;
  mrn: number[];
  desc: string;
  mvprc: number;
  wgt: number;
}

export interface ObjAndPersonCont {
  list: List[];
}
export interface Room {
  title: string;
  desc: Desc;
  icon: number;
  image: string;
  objcont: ObjAndPersonCont;
  perscont: ObjAndPersonCont;
  ver: number;
}
