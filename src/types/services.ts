import { Request } from 'express';
import { User } from 'src/models/user.model';

export type RequestWithUser = Request & { user: User };
