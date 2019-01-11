export interface IHero {
  name?: string;
  status?: any[];
}

export class Hero implements IHero {
  name = '';
  status?: string[] = ['0,0,0,0'];
  constructor(name?: any, status?: any[], ) {
      this.name = name;
  }
}
