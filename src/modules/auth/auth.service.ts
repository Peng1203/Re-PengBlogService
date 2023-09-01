import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '@/modules/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '@/shared/redis/redis.service';
import * as svgCaptcha from 'svg-captcha';
import { ApiResponseCodeEnum } from '@/helper/enums';

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

  private rn(min, max) {
    return parseInt(Math.random() * (max - min) + min);
  }

  private rc(min, max, opacity) {
    let r = this.rn(min, max);
    let g = this.rn(min, max);
    let b = this.rn(min, max);
    return `rgba(${r},${g},${b},${opacity})`;
  }

  /**
   * 生成验证码
   * @date 2023/9/1 - 15:14:05
   * @author Peng
   *
   * @returns {*}
   */
  generateCaptcha() {
    // createMathExpr 创建一个 简单加法的 svg 验证码
    return svgCaptcha.create({
      size: 4, // 验证码长度
      ignoreChars: 'OlI', // 排除字符
      noise: 2, // 干扰线
      color: false, // 验证码字符颜色
      background: this.rc(130, 230, 0.3), // 验证码背景颜色
      // background: "#cc9966" // 验证码背景颜色
    });
  }

  /**
   * 校验验证码
   * @date 2023/9/1 - 16:42:08
   * @author Peng
   *
   * @param {string} captcha
   * @param {*} session
   */
  verifyCaptcha(captcha: string, session) {
    if (!session?.expirationTimestamp || Date.now() > session.expirationTimestamp)
      throw new UnauthorizedException({ code: ApiResponseCodeEnum.UNAUTHORIZED_CAPTCHA_EXPIRE, msg: '验证码已过期!' });

    if (captcha.toLocaleLowerCase() !== session.captcha.toLocaleLowerCase())
      throw new UnauthorizedException({ code: ApiResponseCodeEnum.UNAUTHORIZED_CAPTCHA_ERROR, msg: '验证码输入有误!' });
  }
}
