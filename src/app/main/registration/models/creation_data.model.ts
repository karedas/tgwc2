
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

export class RegistrationData {
  invitation: number;
  race: string;
  sex: string;
  race_code: number;
  stats: IStats;
  culture: string;
  religion: string;
  start: string;
  name: string;
  password: string;
  password2: string;
}
