import { ListCommonParamsDto } from '@/common/dto';
import { IsInt, IsNumber, IsOptional } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FindAllUserDto extends ListCommonParamsDto {
  @ApiProperty({ default: '', required: false, description: '角色id' })
  @IsInt()
  @IsNumber()
  @IsOptional()
  readonly roleId?: number;
}
