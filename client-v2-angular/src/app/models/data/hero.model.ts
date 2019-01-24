export interface IHeroRace {
  code: string;
  name: string;
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
  image?: string;
  race?: IHeroRace;
  title?: string;
  status: IStatus;
  attitude?: string;
  equipment?: [];
  inventory?: [];
  target?: ITarget | null
}

export class Hero implements IHero {

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
