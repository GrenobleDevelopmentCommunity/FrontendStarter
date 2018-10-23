import { Token } from './user.service';

export const enum Role {
    Admin = 'admin',
    User = 'user'
  }

// ASK: Should I put Token in user ?
export interface User {
    email: string;
    role: Role;
}
