import { Deserializable } from "./deserializable.model";

export class User implements Deserializable<User> {
  private _id: number;
  private _name: number;
  private _email: number;
  private _permissions: string[];

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get name(): number {
    return this._name;
  }

  set name(value: number) {
    this._name = value;
  }

  get email(): number {
    return this._email;
  }

  set email(value: number) {
    this._email = value;
  }

  get permissions(): string[] {
    return this._permissions;
  }

  set permissions(value: string[]) {
    this._permissions = value;
  }


  hasPermission (permission: string): boolean {
    return this.permissions.indexOf(permission) >= 0;
  }

  deserialize(input: any): User {
    Object.assign(this, input);
    return this;
  }
}