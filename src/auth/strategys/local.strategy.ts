import { IStrategyOptions, Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'userName',
      passwordField: 'password',
    } as IStrategyOptions);
  }

  async validate(userName: string, password: string): Promise<any> {
    console.log('userName ----->', userName);
    console.log('password ----->', password);
    return 121;
  }
}
