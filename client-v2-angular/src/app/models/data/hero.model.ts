export interface IHero {
  name: string
  status: number[]
}

export class Hero implements IHero {
  name: string;
  status: [0,0,0,0];
  constructor(name?:string) {
      this.name = name;
  }
}
