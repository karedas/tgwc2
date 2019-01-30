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

export interface IHero {
  name?: string;
  adjective?: string;
  race?: IHeroRace;
  image?: string;
  conva: number;
  combat?: any;
  walk?: string;
  title?: string;
  status: IStatus;
  equipment?: [];
  inventory?: [];
  target?: ITarget | null;
}

export class Hero implements IHero {

  conva: 0;
  status: IStatus;

  constructor(...args ) {
    this.status = {
      drink: 0,
      food: 0,
      hit: 0,
      move: 0
    };
  }
}
