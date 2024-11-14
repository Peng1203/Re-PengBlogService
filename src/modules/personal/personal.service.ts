import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { CreatePersonalDto } from './dto/create-personal.dto'
import { UpdatePersonalDto } from './dto/update-personal.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Personal } from '@/common/entities'
import { Repository } from 'typeorm'
import { UserService } from '../user/user.service'
import { ApiResponseCodeEnum } from '@/helper/enums'

@Injectable()
export class PersonalService {
  constructor(
    @InjectRepository(Personal) private readonly personalRepository: Repository<Personal>,
    private readonly userService: UserService
  ) {}

  async findOne(userId: number) {
    try {
      let personalInfo = await this.personalRepository.findOne({ where: { userId } })
      if (!personalInfo) {
        await this.create(userId)
        personalInfo = await this.personalRepository.findOne({ where: { userId } })
      }
      const userInfo = await this.userService.findUserArticleInfo(userId)
      const { userName, nickName, userAvatar, email, articles, categorys, tags } = userInfo
      return {
        userName,
        nickName,
        userAvatar,
        email,
        articleCount: articles.length,
        categoryCount: categorys.length,
        tagCount: tags.length,
        ...personalInfo,
      }
    } catch (e) {
      throw new InternalServerErrorException({
        e,
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_FIND,
        msg: '获取用户个人信息失败',
      })
    }
  }

  private async create(userId: number) {
    const personal = await this.personalRepository.create({ userId })
    console.log('personal ------', personal)
    await this.personalRepository.save(personal)
    return personal
  }

  update(id: number, updatePersonalDto: UpdatePersonalDto) {
    return `This action updates a #${id} personal`
  }
}
