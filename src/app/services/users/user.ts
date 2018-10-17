export const enum Role {
    Admin,
    User
  }

export interface User {
    password: string;
    email: string;
}

export interface Token {
    token: string;
    role: Role;
}
