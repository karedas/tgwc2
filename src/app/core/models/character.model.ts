import { Deserializable } from "./deserializable.model";

export class Character implements Deserializable<Character> {
  filter(arg0: (char: any) => boolean): any {
    throw new Error("Method not implemented.");
  }
  
  id: number;
  createdDate: string;
  image: string;
  name: string;
  race: string;
  sex: string;
  status: number;
  txtrace: string;
  age: number;

  deserialize(input: any): Character {
    Object.assign(this, input);
    return this;
  }
}