export interface IHeroRace {
  name: string;
  code: string;
}

export interface IStatus {
  drink?: number;
  food?: number;
  hit?: number;
  move?: number;
}

export interface ITarget {
  hit?: number;
  move?: number;
  icon?: number;
  name?: string;
}

export interface ISex {
  name: string;
  code: string;
}

export interface IHero {
  name?: string;
  adjective?: string;
  desc?: string;
  race?: IHeroRace;
  cult?: string;
  ethn?: string;
  image?: string;
  conva?: number;
  combat?: any;
  walk?: string;
  title?: string;
  status?: IStatus;
  relig?: string;
  sex?: ISex;
  equipment?: [];
  inventory?: [];
  target?: ITarget | null;
  lang?: string;
  weight?: number;
  height?: number;
  born?: string;
  age?: number;
  icon?: number;
  city?: string;
  abil?: any;
  skills?: any;
}

// export class Hero implements IHero {

  // conva: 0;
  // status: IStatus;

  // constructor(...args ) {
    // this.status = {
    //   drink: 0,
    //   food: 0,
    //   hit: 0,
    //   move: 0
    // };
//   }
// }
