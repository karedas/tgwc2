export interface IHeroRace{
  code: string;
  name: string;
}

export interface IHero {
  name?: string;
  adjective?: string;
  image?: string;
  race?: IHeroRace;
  title?: string;
  status: any[];
}

export class Hero implements IHero {
  status: any[] = [0,0,0,0];
  constructor(...args ) {
    this.status = [0,0,0,0]
  }
}
