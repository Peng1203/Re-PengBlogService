import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { PersonalService } from './personal.service'
import { CreatePersonalDto } from './dto/create-personal.dto'
import { UpdatePersonalDto } from './dto/update-personal.dto'
import { Public } from '@/common/decorators'
import { ParseIntParamPipe } from '@/common/pipe'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { UserService } from '../user/user.service'

@ApiTags('User')
@ApiBearerAuth()
@Controller('personal')
export class PersonalController {
  constructor(private readonly personalService: PersonalService, private readonly userService: UserService) {}

  @Public()
  @Get(':id')
  @ApiOperation({ summary: '获取用户个人信息' })
  async findOne(@Param('id', new ParseIntParamPipe('id参数有误')) id: number) {
    await this.userService.findOneById(id)
    return this.personalService.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新用户个人信息' })
  update(@Param('id', new ParseIntParamPipe('id参数有误')) id: number, @Body() data: UpdatePersonalDto) {
    return this.personalService.update(+id, data)
  }
}
