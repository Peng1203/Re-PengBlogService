import { Controller, Get, Sse, MessageEvent, Param, BadRequestException, ConflictException } from '@nestjs/common';
import { SystemService } from './system.service';
import { Observable, Subject, interval, map } from 'rxjs';
import { Public } from '@/common/decorators';
import { OnEvent } from '@nestjs/event-emitter';
import { EventsEnum } from '@/helper/enums';
import { MutexService } from '@/shared/mutex/mutex.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResponseCodeEnum } from '@/helper/enums';

@ApiTags('System')
@ApiBearerAuth()
@Controller('system')
export class SystemController {
  private readonly serveNames: string[] = ['web', 'admin', 'serve'];
  private updateTrigger$ = new Subject<void>();
  // 更新计数器
  private updateCounter = 0;
  constructor(private readonly systemService: SystemService, private readonly mutexService: MutexService) {}

  @Public()
  @Sse('test')
  test(): Observable<MessageEvent> {
    return interval(1000).pipe(map(_ => ({ data: 'hello world' })));
  }

  @Sse('update/:serveName')
  @Public()
  @ApiOperation({ summary: '更新服务' })
  handleUpdate(@Param('serveName') serveName: string) {
    if (!serveName || !this.serveNames.includes(serveName))
      throw new BadRequestException({
        code: ApiResponseCodeEnum.BADREQUEST,
        msg: '更新服务参数有误!',
      });

    if (this.updateCounter > 0) throw new ConflictException({ message: 'Conflict Exception' });
    this.updateCounter++;
    this.systemService.updateSystem(serveName);
    return this.updateTrigger$.pipe(
      map(params => ({
        data: params as any,
      }))
    );
  }
  @OnEvent(EventsEnum.UPDATE_SYSTEM_MSG)
  handleUpdateTrigger(params: any) {
    this.updateTrigger$.next(params);
  }
  @OnEvent(EventsEnum.UPDATE_SYSTEM_COMPLETED)
  handleUpdateCompleted() {
    this.updateCounter = 0;
    // this.updateTrigger$.complete();
  }

  @Get()
  @Public()
  async testMutexLock(): Promise<string> {
    console.count('请求来了 ------');
    // 使用互斥锁保护的代码块
    const result = await this.mutexService.runLocked<string>(async () => {
      // 在这里执行需要互斥保护的操作
      console.log('开始执行锁中任务...');

      // 模拟耗时的操作
      await new Promise(resolve => setTimeout(resolve, 10000));

      console.log('锁中任务执行完成!');

      return 'Hello world!';
    });

    return result;
  }
}
