import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy, StrategyOptions } from "passport-jwt";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
      issuer: configService.get<string>('JWT_ISSUER'),
    } as StrategyOptions);
  }
  // user 参数为 获取解析token的数据 return 内容 会作为 request 对象的 user属性存在
  async validate(payload: any) {
    console.log('JWT策略触发 ----->', payload);
    return 1212;
  }
}