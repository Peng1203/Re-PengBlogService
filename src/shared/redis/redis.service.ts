import Redis from 'ioredis';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ApiResponseCodeEnum } from '@/helper/enums';

@Injectable()
export class RedisService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  /**
   * 获取Redis实例
   * @date 2023/8/31 - 17:53:10
   * @author Peng
   *
   * @returns {*}
   */
  getRedisRef() {
    return this.redis;
  }

  /**
   * 设置缓存
   * @date 2023/8/31 - 17:59:33
   * @author Peng
   *
   * @async
   * @param {string} key
   * @param {*} value
   * @param {?number} [seconds]
   * @returns {Promise<boolean>}
   */
  async setCache(key: string, value: any, seconds?: number): Promise<boolean> {
    try {
      if (typeof value === 'object') value = JSON.stringify(value);
      const setResult =
        seconds === undefined ? await this.redis.set(key, value) : await this.redis.setex(key, seconds, value);
      if (setResult !== 'OK') return false;
      return setResult === 'OK';
    } catch (e) {
      throw new InternalServerErrorException({ e, code: ApiResponseCodeEnum.INTERNALSERVERERROR });
    }
  }
}
