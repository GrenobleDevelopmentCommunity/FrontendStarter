import { InMemoryDbService, RequestInfo, RequestInfoUtilities, ResponseOptions } from 'angular-in-memory-web-api';
import { Observable } from 'rxjs';

export const enum Role {
  Admin,
  User
}

export interface Token {
  token: string;
  role: Role;
}

export interface User extends Token {
  id: number;
  username: string;
  password: string;
  email: string;
}

interface Db {
  users: User[];
}

export class InMemoryDataService implements InMemoryDbService {
  createDb(): Db {
    localStorage.clear();
    console.log('creation de la base de donnees');
    const users: User[] = [
      { id: 1, username: 'max', password: 'max', email: 'max.chev@mail.com', token: null, role: Role.Admin },
      { id: 2, username: 'maxime', password: 'max', email: 'max.chev@mail.com', token: null, role: Role.User }
    ];
    return { users };
  }

  // Overrides the genId method to ensure that a user always has an id.
  // If the users array is empty,
  // the method below returns the initial number (1).
  // if the heroes array is not empty, the method below returns the highest
  // hero id + 1.
  genId(users: User[]): number {
    return users.length > 0 ? Math.max(...users.map(user => user.id)) + 1 : 1;
  }

  post(reqInfo: RequestInfo): Observable<ResponseOptions> {
    console.log(reqInfo);
    // FIXME : URL
    return reqInfo.utils.createResponse$(() => {
      switch ((reqInfo.req as any).body.request) {
        case 'login':
          return this.login(reqInfo);
        case 'logout':
          return this.logout(reqInfo);
        default:
          throw new Error('Neither login or logout');
      }
    });
  }

  login(reqInfo: RequestInfo): ResponseOptions {
    const user = this.getUser(reqInfo);

    if (user) {
      const body = this.createBody(user);
      user.token = body.token;
      return {
        body,
        status: 200
      };
    }
    return { status: 401 };
  }

  logout(reqInfo: RequestInfo): ResponseOptions {
    const user = this.getUser(reqInfo);
    if (user) {
      user.token = null;
      return {
        status: 200
      };
    }
    return { status: 200 }; // ASK: Pour deconnecter dans tous les cas.
  }

  createBody({role, id}: User): Token {
    const token = 'ABC' + id;
    return { role, token };
  }

  getUser(reqInfo: RequestInfo): User {
    const { request, ...criteria } = (reqInfo.req as any).body;
    const keys: string[] = Object.keys(criteria);
    return (reqInfo.collection as User[])
      .find(user => keys.every(key => criteria[key] === user[key]));
  }
}
