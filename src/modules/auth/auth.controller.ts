import { Body, Controller, ForbiddenException, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserLoginDto } from './dto';
import { LocalAuthGuard } from './guards/local.auth.guard';
import { Request } from 'express';
import { Public } from '@/common/decorators';
import { ApiResponseCodeEnum } from '@/helper/enums';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async login(@Req() req: Request, @Body() data: UserLoginDto) {
    const user = req.user;
    if (!user.userEnabled)
      throw new ForbiddenException({ code: ApiResponseCodeEnum.FORBIDDEN, msg: '账号已被禁用!请联系管理员' });

    const token = await this.authService.generateToken(user.id, user.userName);
    return {
      token,
      ...user,
    };
  }
}
