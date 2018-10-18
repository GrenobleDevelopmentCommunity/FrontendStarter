import { Token } from './user.service';

export const enum Role {
    Admin,
    User
  }

// ASK: Should I put Token in user ?
export interface User {
    email: string;
    role: Role;
    token: Token;
}