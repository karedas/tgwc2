
export interface IStats {
  strength: number,
  constitution: number,
  size: number,
  dexterity: number,
  speed: number,
  empathy: number,
  intelligence: number,
  willpower: number
}

export const attributes: IStats = {
  strength: 0,
  constitution: 0,
  size: 0,
  dexterity: 0,
  speed: 0,
  empathy: 0,
  intelligence: 0,
  willpower: 0
}

export class RegistrationData {
  invitation: string;
  email: string;
  race: any;
  sex: string;
  race_code: string;
  race_label: string;
  stats: IStats;
  culture: string;
  religion: string;
  start: string;
  name: string;
  password: string;
  password2: string; 
  constructor() {
    this.invitation = '';
    this.email = '';
    this.race = '';
    this.sex = '';
    this.race_code = '';
    this.race_label = '';
    this.stats = undefined;
    this.culture = '';
    this.religion = '';
    this.start = '';
    this.name = '';
    this.password = '';
    this.password2 = ''; 
  }
}
