export interface IHeroRace {
  name: string;
  code: string;
}

export interface IStatus {
  drink?: number;
  food?: number;
  hit?: number;
  move?: number;
  msg?: string;
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
  fede?: string;
  sex?: ISex;
  equipment?: [];
  inventory?: [];
  target?: ITarget;
  lang?: string;
  weight?: number;
  height?: number;
  born?: string;
  age?: number;
  icon?: number;
  city?: string;
  abil?: any;
  skills?: any;
  money?: number;
  pietoso?: number;
  position?: number;
}

// export class Hero implements IHero {
//   constructor() {}
// }
