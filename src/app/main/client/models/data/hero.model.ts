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
  money?: string;
  cult?: string;
  ethn?: string;
  image?: string;
  conva?: string;
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
  weight?: string;
  height?: string;
  born?: string;
  age?: string;
  icon?: string;
  city?: string;
  abil?: any;
  skills?: any;
  pietoso?: string;
  position?: string;
}

// export class Hero implements IHero {
//   constructor() {}
// }
