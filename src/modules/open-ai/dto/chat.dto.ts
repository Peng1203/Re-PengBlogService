import { IsString } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChatDto {
  @IsString()
  @ApiProperty({ description: '聊天内容' })
  content: string;
}
