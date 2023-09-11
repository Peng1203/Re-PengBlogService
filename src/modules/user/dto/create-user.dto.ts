import { IsArrayNumber } from '@/common/validator';
import { UserEnabledEnum } from '@/helper/enums';
import {
  IsArray,
  IsDefined,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  MinLength,
  Validate,
} from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  @MaxLength(8)
  @ApiProperty({ description: '用户名称' })
  readonly userName: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({ description: '密码' })
  readonly password: string;

  @IsArray()
  @Validate(IsArrayNumber)
  @ApiProperty({ description: '用户角色id数组' })
  readonly roleIds: number[];

  @IsEmail()
  @IsOptional()
  @ApiProperty({ description: '邮箱' })
  readonly email?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: '昵称' })
  readonly nickName?: string;

  @IsEnum(UserEnabledEnum)
  @ApiProperty({ description: '用户状态 0禁用 1启用' })
  readonly userEnabled?: UserEnabledEnum;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: '用户头像' })
  readonly userAvatar?: string;
}
