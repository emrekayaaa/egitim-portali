import { Homework } from "./homwork";
import { User } from "./user";

export class Lesson {
  uid!: string;
  name!: string;
  credit!: number;
  teacherId!: string | User;
  homeworks!: string[] | Homework[];
}
