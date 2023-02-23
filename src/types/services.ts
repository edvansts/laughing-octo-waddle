import { Request } from 'express';
import { ClsStore } from 'nestjs-cls';
import { User } from 'src/models/user.model';

export type RequestWithUser = Request & { user: User };

export interface AppStore extends ClsStore {
  user: User;
}
