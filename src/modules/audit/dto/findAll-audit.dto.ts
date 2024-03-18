import { ListCommonParamsDto } from '@/common/dto';
import { IsInt, IsNumber, IsOptional } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FindAllAuditDto extends ListCommonParamsDto {
  @IsInt()
  @IsNumber()
  @IsOptional()
  @ApiProperty({ default: '', required: false, description: '操作用户ID' })
  readonly userId?: number;
}
