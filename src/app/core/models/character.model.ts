import { Deserializable } from "./deserializable.model";

export class Character implements Deserializable<Character> {
  
  id: number;
  createdDate: string;
  image: string;
  name: string;
  race: string;
  sex: string;
  status: string;
  age: number;

  deserialize(input: any): Character {
    Object.assign(this, input);
    return this;
  }
}