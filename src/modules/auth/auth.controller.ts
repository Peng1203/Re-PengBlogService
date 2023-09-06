import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserLoginDto } from './dto';
import { LocalAuthGuard } from './guards/local.auth.guard';
import { Request } from 'express';
import { Keep, Public } from '@/common/decorators';
import { ApiResponseCodeEnum } from '@/helper/enums';
import { ConfigService } from '@nestjs/config';
import { SessionInfo } from 'express-session';

@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly configService: ConfigService) {}

  @Keep()
  @Public()
  @Get('login/captcha')
  @Header('Content-Type', 'image/svg+xml')
  @ApiOperation({ summary: '获取验证码' })
  @ApiProduces('image/svg+xml') // 指定响应类型为SVG图像
  getCaptcha(@Session() session: SessionInfo) {
    const { text, data } = this.authService.generateCaptcha();
    session.captcha = text;
    const CAPTCHA_EXPIRES = Number(this.configService.get<string>('CAPTCHA_EXPIRES'));
    // 方案1 设置一个 setTimeout 到时自动删除 session对象的验证码字段
    // 方案2 在生成验证码时记录一个过期时间戳 登录时进行时间戳对比
    // 设置验证码的过期时间戳
    session.expirationTimestamp = Date.now() + CAPTCHA_EXPIRES;

    console.log('session ----->', session);

    return data;
  }

  @Public()
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '登录' })
  async login(@Req() req: Request, @Body() data: UserLoginDto, @Session() session: SessionInfo) {
    const { password, ...user } = req.user;
    if (!user.userEnabled)
      throw new ForbiddenException({ code: ApiResponseCodeEnum.FORBIDDEN, msg: '账号已被禁用!请联系管理员' });

    const token = await this.authService.generateAccessToken(user.id, user.userName);

    // redis 设置token
    await this.authService.setTokenToRedis(this.authService.redisTokenKeyStr(user.id, user.userName), token);

    // 登录成功 删除 session 设置的验证码和 过期日期
    delete session.captcha;
    delete session.expirationTimestamp;

    return {
      token,
      ...user,
    };
  }
}
