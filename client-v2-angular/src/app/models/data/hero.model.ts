export interface IHero {
  name: string
  status?: []
}

export class Hero implements IHero {
  name: string;
  constructor(name?:string) {
      this.name = name;
  }
}
