import { CommentType } from '@/helper/enums'
import { IsEmail, IsEnum, IsInt, IsNumber, IsOptional, IsString, Min } from '@nestjs/class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateCommentDto {
  @IsString()
  @ApiProperty({ description: '名称' })
  userName: string

  @IsString()
  @ApiProperty({ description: '评论内容' })
  content: string

  @IsEmail()
  @ApiProperty({ description: '邮箱' })
  email: string

  @IsString()
  @IsOptional()
  @ApiProperty({ description: '头像' })
  avatar?: string

  @IsInt()
  @IsNumber()
  @IsEnum(CommentType)
  @ApiProperty({ description: '评论类型' })
  type?: CommentType

  @Min(0)
  @IsInt()
  @IsNumber()
  @ApiProperty({ description: '关联的文章ID或动态ID' })
  targetId: number

  @Min(0)
  @IsInt()
  @IsNumber()
  @ApiProperty({ description: 'id 0或者null 为父级评论', default: 0 })
  parentId: number
}
