import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { StatusEnum, RequestMethodEnum, ApiResponseCodeEnum } from '@/helper/enums';
import { Response, Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Audit } from '@/common/entities';
import { Repository } from 'typeorm';
import { FindAllAuditDto } from './dto';

@Injectable()
export class AuditService {
  constructor(@InjectRepository(Audit) private readonly auditRepository: Repository<Audit>) {}

  async createAuditRecord(
    req: Request,
    res: Response,
    operationStatus: StatusEnum,
    responseTime?: number,
    errMessage?: string,
    statusCode?: number
  ) {
    try {
      const { method, originalUrl, useragent, query, body, path, ip } = req;
      // const { statusCode } = res;

      const clientIp = req.headers['x-real-ip'] || req.headers['x-forwarded-for'];
      const audit = new Audit();

      audit.method = RequestMethodEnum[method];
      // audit.router = originalUrl;
      audit.router = path;
      audit.ip = ((Array.isArray(clientIp) ? clientIp[0] : clientIp) || ip).replace('::ffff:', '');
      audit.userAgent = useragent.source;
      audit.statusCode = statusCode || res.statusCode;
      audit.responseTime = responseTime;
      audit.requestQueryParams = JSON.stringify(query);
      audit.requestBodyParams = JSON.stringify(body);
      audit.operationStatus = operationStatus;
      errMessage && (audit.errMessage = errMessage);
      audit.description = '';
      audit.user = req.user;

      const auditRecord = await this.auditRepository.create(audit);
      return await this.auditRepository.save(auditRecord);
    } catch (e) {
      console.log('审计记录创建失败 ------', e);
    }
  }

  async findAll(params: FindAllAuditDto) {
    try {
      const { page, pageSize, queryStr = '', column, order, userId = 0 } = params;

      // const [list, total] = await this.auditRepository.findAndCount({
      //   where: [
      //     {
      //       user: userId as any,
      //     },
      //   ],
      //   skip: (page - 1) * pageSize,
      //   take: pageSize,
      //   order: { [column]: order },
      //   relations: ['user'],
      // });

      const queryBuilder = this.auditRepository
        .createQueryBuilder('audit')
        .leftJoinAndSelect('audit.user', 'user')
        // .select(['user.userName'])
        .skip((page - 1) * pageSize)
        .take(pageSize)
        .orderBy(`audit.${column || 'id'}`, order || 'ASC');

      userId && queryBuilder.where('user.id = :userId', { userId });

      const [list, total] = await queryBuilder.getManyAndCount();
      return {
        list: list.map(({ user, ...args }) => ({
          ...args,
          userId: user.id,
          userName: user.userName,
        })),
        total,
      };
    } catch (e) {
      throw new InternalServerErrorException({
        e,
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_FIND,
        msg: '查询审计列表失败',
      });
    }
  }

  remove(id: number) {
    return `This action removes a #${id} audit`;
  }
}
