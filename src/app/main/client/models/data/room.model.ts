import { Eqcont } from './objpers.model';


export interface Desc {
  base: string;
  details: string;
  repeatlast: boolean;
}

export interface RoomList {
  type: string;
  icon: number;
  cond: number;
  condprc: number;
  mrn: number[];
  desc: string[];
  mvprc: number;
  sz: number;
  wgt: number;
}

export interface ObjAndPersonCont {
  list: RoomList[];
}
export interface Room {
  title: string;
  desc: Desc;
  icon: number;
  image: string;
  objcont: ObjAndPersonCont;
  perscont: ObjAndPersonCont;
  ver: number;
  dir: string;
  mv: any;
  where: any
  eqcont: Eqcont
}
