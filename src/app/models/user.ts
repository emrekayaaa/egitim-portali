import { IRole } from "./role";

export class User {
  uid!: string;
  displayName!: string;
  email!: string;
  password!: string;
  role!: keyof IRole;
}
