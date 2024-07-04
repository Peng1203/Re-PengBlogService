import { IsOptional, IsString, MaxLength } from '@nestjs/class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateCategoryDto {
  @IsString()
  @MaxLength(6)
  @ApiProperty({ description: '分类名' })
  categoryName: string
}
