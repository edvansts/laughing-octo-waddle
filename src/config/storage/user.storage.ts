import { AsyncLocalStorage } from 'async_hooks';
import { User } from 'src/models/user.model';

export class UserStorage {
  static storage = new AsyncLocalStorage<User>();

  static get() {
    return this.storage.getStore() as User;
  }

  static set(user: User) {
    return this.storage.enterWith(user);
  }
}
