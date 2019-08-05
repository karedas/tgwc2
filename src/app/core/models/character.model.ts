import { Deserializable } from './deserializable.model';

export class Character implements Deserializable<Character> {

  id: number;
  createdDate: string;
  is_default?: boolean;
  image: string;
  name: string;
  race: string;
  ethnicity: string;
  sex: string;
  status: number;
  txtrace: string;
  age: number;
  
  filter(arg0: (char: any) => boolean): any {
    throw new Error('Method not implemented.');
  }

  deserialize(input: any): Character {
    Object.assign(this, input);
    return this;
  }
}
