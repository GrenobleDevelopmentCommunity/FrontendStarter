import { Token } from './user.service';

export const enum Role {
    Admin = 1,
    User = 2
  }

// ASK: Should I put Token in user ?
export interface User {
    email: string;
    role: Role;
}
