import { Injectable } from '@nestjs/common';
import { UserService } from '@/modules/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '@/shared/redis/redis.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly redis: RedisService,
  ) {}

  /**
   * 账号密码校验用户
   * @date 2023/8/30 - 16:39:05
   * @author Peng
   *
   * @param {string} userName
   * @param {string} password
   * @returns {*}
   */
  validateUser(userName: string, password: string) {
    return this.userService.findOneByUserNameAndPwd(userName, password);
  }

  // 生成token
  async generateToken(id: number, userName: string) {
    return `${await this.jwtService.signAsync({
      sub: id,
      userName,
    })}`;
  }

  // 验证token
  async verifyToken(token: string): Promise<boolean | { userName: string; id: number }> {
    try {
      const { sub, userName } = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      return { id: sub, userName };
    } catch (e) {
      return false;
    }
  }

  async setTokenToRedis(key: string, token: string) {
    await this.redis.setCache(key, token, this.configService.get<number>('JWT_EXPIRES'));
  }
}
