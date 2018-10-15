import { InMemoryDbService, RequestInfo, RequestInfoUtilities, ResponseOptions } from 'angular-in-memory-web-api';
import { User } from './user';

export class InMemoryDataService implements InMemoryDbService {


  createDb() {
    console.log('creation de la base de donnees');
    const users = [
      { id: 1, username: 'max', password: 'max', email: 'max.chev@mail.com', token: '' },
      { id: 2, username: 'maxime', password: 'max', email: 'max.chev@mail.com', token: '' }
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

  post(reqInfo: RequestInfo) {
    return reqInfo.utils.createResponse$(() => {
      console.log(reqInfo);
      if ( reqInfo.req['body']['request'] === 'login') {
        return this.login(reqInfo);
      } else if (reqInfo.req['body']['request'] === 'logout') {
        return this.logout(reqInfo);
      }
    });
  }

  login(reqInfo: RequestInfo): ResponseOptions {
    if (this.isRegistered(reqInfo)) {
      const token = this.createToken(reqInfo);
      return {
        body: token,
        status: 200
      };
    } else {
      return {
        status: 401
      };
    }
  }

  logout(reqInfo: RequestInfo): ResponseOptions {
    const token = reqInfo.req['body']['token'];
    for (let index = 0; index < reqInfo.collection.length; index++) {
      const element = reqInfo.collection[index];
      if (element['token'] === token) {
        element['token'] = '';
        return  {
          status: 200
        };
      }
      return {
        status: 401
      };
    }
  }

  createToken(reqInfo: RequestInfo): string {
    const password = reqInfo.req['body']['password'];
    const login = reqInfo.req['body']['username'];
    let token = '';
    for (let index = 0; index < reqInfo.collection.length; index++) {
      const element = reqInfo.collection[index];
      if (element['username'] === login && element['password'] === password) {
        token = 'ABC';
        element['token'] = token;
        console.log(reqInfo.collection);
        break;
      }
    }
    return token;
  }

  isRegistered(reqInfo: RequestInfo): boolean {
    const password = reqInfo.req['body']['password'];
    const login = reqInfo.req['body']['username'];
    let registered = false;
    reqInfo.collection.forEach(element => {
      if (element['username'] === login && element['password'] === password) {
        registered = true;
        return;
      }
    });
    return registered;
  }
}
