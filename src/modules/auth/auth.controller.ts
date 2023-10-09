import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
  Res,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RefreshTokenDto, UserLoginDto } from './dto';
import { LocalAuthGuard } from './guards/local.auth.guard';
import { Request, Response } from 'express';
import { Public } from '@/common/decorators';
import { ApiResponseCodeEnum } from '@/helper/enums';
import { ConfigService } from '@nestjs/config';
import { SessionInfo } from 'express-session';
import { CaptchaAggregation } from './decorator';
import { CosService } from '@/shared/COS/cos.service';

@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly COS: CosService,
  ) {}

  @Get('login/captcha')
  @CaptchaAggregation()
  getCaptcha(@Session() session: SessionInfo) {
    const { text, data } = this.authService.generateCaptcha();
    session.captcha = text;
    const CAPTCHA_EXPIRES = Number(this.configService.get<string>('CAPTCHA_EXPIRES'));

    // 方案1 设置一个 setTimeout 到时自动删除 session对象的验证码字段
    // 方案2 在生成验证码时记录一个过期时间戳 登录时进行时间戳对比
    // 设置验证码的过期时间戳
    session.expirationTimestamp = Date.now() + CAPTCHA_EXPIRES;
    return data;
  }

  @Public()
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '登录' })
  async login(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() data: UserLoginDto,
    @Session() session: SessionInfo,
  ) {
    const { password, ...user } = req.user;
    if (!user.userEnabled)
      throw new ForbiddenException({
        code: ApiResponseCodeEnum.FORBIDDEN_USER_DISABLED,
        msg: '账号已被禁用!请联系管理员',
      });

    const access_token = await this.authService.generateAccessToken(user.id, user.userName);
    const refresh_token = await this.authService.generateRefreshToken(user.id);

    // redis 设置token
    await this.authService.setTokenToRedis(
      this.authService.redisTokenKeyStr(user.id, user.userName),
      access_token,
    );

    // 登录成功 删除 session 设置的验证码和 过期日期
    delete session.captcha;
    delete session.expirationTimestamp;

    res.resMsg = '登录成功';

    return {
      user,
      tokens: { access_token, refresh_token },
    };
  }

  @Public()
  @Patch('auth/refreshAccessToekn')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '刷新accessToken' })
  async refreshAccessToken(@Body() data: RefreshTokenDto) {
    const payload = await this.authService.verifyRefresToken(data.refresh_token);
    const user = await this.authService.findUserById(payload.sub);
    if (!user.userEnabled)
      throw new ForbiddenException({
        code: ApiResponseCodeEnum.FORBIDDEN_USER_DISABLED,
        msg: '账号已被禁用!请联系管理员',
      });

    const access_token = await this.authService.generateAccessToken(user.id, user.userName);
    const refresh_token = await this.authService.generateRefreshToken(user.id);

    // redis 设置token
    await this.authService.setTokenToRedis(
      this.authService.redisTokenKeyStr(user.id, user.userName),
      access_token,
    );

    return {
      access_token,
      refresh_token,
    };
  }
}
