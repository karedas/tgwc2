import { Deserializable } from './deserializable.model';

export class User implements Deserializable<User> {
  id: number;
  name: string;
  email: string;
  permissions: string[];
  image: string;

  hasPermission (permission: string): boolean {
    return this.permissions.indexOf(permission) >= 0;
  }

  deserialize(input: any): User {
    Object.assign(this, input);
    return this;
  }
}
