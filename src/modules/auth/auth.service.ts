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

  /**
   * 生成token
   * @date 2023/9/1 - 14:52:01
   * @author Peng
   *
   * @async
   * @param {number} id
   * @param {string} userName
   * @returns {unknown}
   */
  async generateToken(id: number, userName: string) {
    return `${await this.jwtService.signAsync({
      sub: id,
      userName,
    })}`;
  }

  /**
   * 校验token
   * @date 2023/9/1 - 14:52:20
   * @author Peng
   *
   * @async
   * @param {string} token
   * @returns {Promise<boolean | { userName: string; id: number }>}
   */
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

  /**
   * 设置 token到redis
   * @date 2023/9/1 - 14:52:29
   * @author Peng
   *
   * @async
   * @param {string} key
   * @param {string} token
   * @returns {*}
   */
  async setTokenToRedis(key: string, token: string) {
    await this.redis.setCache(key, token, this.configService.get<number>('JWT_EXPIRES'));
  }

  /**
   * 获取 redis token key
   * @date 2023/9/1 - 14:52:48
   * @author Peng
   *
   * @param {number} id
   * @param {string} userName
   * @returns {string}
   */
  redisTokenKeyStr(id: number, userName: string) {
    return `user_token:${id}-${userName}`;
  }
}
