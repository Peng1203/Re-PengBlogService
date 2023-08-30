import { Injectable } from '@nestjs/common';
import { UserService } from '@/modules/user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) { }

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
    return this.userService.findOneByUserNameAndPwd(userName, password)
  }
}
