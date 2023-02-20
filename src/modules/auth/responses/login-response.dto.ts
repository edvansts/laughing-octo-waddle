import { User } from 'src/models/user.model';

export class LoginResponseDto {
  user: User;
  token: string;
}
