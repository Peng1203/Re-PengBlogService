import { IsString, MaxLength } from '@nestjs/class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateCategoryDto {
  @IsString()
  @MaxLength(6)
  @ApiProperty({ description: '分类名' })
  categoryName: string

  @IsString()
  @MaxLength(255)
  @ApiProperty({ description: '分类描述' })
  description: string
}
