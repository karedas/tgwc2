import { Deserializable } from "./deserializable.model";

export class Characters implements Deserializable<Characters> {
  
  id: number;
  createdDate: string;
  image: string;
  name: string;
  race: string;
  sex: string;
  status: string;
  age: number;

  deserialize(input: any): Characters {
    Object.assign(this, input);
    return this;
  }
}