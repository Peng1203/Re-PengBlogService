import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserDto, FindAllUserDto } from './dto';
import { UpdateUserDto } from './dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: '查询全部用户' })
  async findAll(@Query() query: FindAllUserDto) {
    const { list: data, total } = await this.usersService.findAll(query);
    const list = data.map(({ role, ...user }) => ({
      ...user,
      roleId: role.id,
    }));
    return { list, total };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id/:aid')
  @ApiParam({ name: 'id', description: '用户ID', type: 'string' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
