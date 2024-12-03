import { Injectable } from '@nestjs/common'
import { CreateCommentDto } from './dto/create-comment.dto'
import { UpdateCommentDto } from './dto/update-comment.dto'
import { SensitiveWordsService } from '@/common/service'
import { Comment } from '@/common/entities'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { IpService } from '@/shared/ip/ip.service'
import { Details } from 'express-useragent'
import { pickBy } from 'lodash'

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private readonly commentRepository: Repository<Comment>,
    private readonly sensitiveWordsService: SensitiveWordsService,
    private readonly ipService: IpService
  ) {}

  async create(data: CreateCommentDto, userAgentInfo: Details, ip: string) {
    // 判断发言是否为敏感发言
    const { text } = this.sensitiveWordsService.getMint().filter(data.content, { replace: true })
    data.content = text

    // 当输入的为qq邮箱 自动获取头像 前端实现

    // 解析ip 设置归属地
    const ipInfo = this.ipService.resolveIp(ip)

    // 解析UA获取设备信息
    const aboutDeviceInfo = pickBy(userAgentInfo, val => val === true)
    const deviceInfo = {} as any
    for (const key in aboutDeviceInfo) {
      if (key === 'isAuthoritative') continue
      deviceInfo[key.replace('is', '')] = aboutDeviceInfo[key]
    }
    deviceInfo.version = userAgentInfo.version

    const { userName: name, ...args } = data
    const comment = this.commentRepository.create({
      ...args,
      name,
      ip,
      userAgent: userAgentInfo.source,
      location: JSON.stringify(ipInfo),
      device: JSON.stringify(deviceInfo),
    })
    return await this.commentRepository.save(comment)
  }

  findAll() {
    return `This action returns all comment`
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`
  }

  remove(id: number) {
    return `This action removes a #${id} comment`
  }
}
