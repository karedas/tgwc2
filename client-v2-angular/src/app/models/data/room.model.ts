
import { List} from 'immutable';


export interface Desc {
  base: string;
  repeatlast: boolean;
}

export interface RoomList {
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
  list: RoomList[];
}
export interface Room {
  title: string;
  desc: List<Desc>;
  icon: number;
  image: string;
  objcont: ObjAndPersonCont;
  perscont: ObjAndPersonCont;
  ver: number;
}
