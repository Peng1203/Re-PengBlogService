import { Controller, Get, Sse, Res, Req, MessageEvent } from '@nestjs/common';
import { SystemService } from './system.service';
import { CreateSystemDto } from './dto/create-system.dto';
import { UpdateSystemDto } from './dto/update-system.dto';
import { Observable, Subject, interval, map } from 'rxjs';
import { Public } from '@/common/decorators';
import { Request, Response } from 'express';
import { OnEvent } from '@nestjs/event-emitter';
import { EventsEnum } from '@/helper/enums/events';
import { MutexService } from '@/shared/mutex/mutex.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('System')
@ApiBearerAuth()
@Controller('system')
export class SystemController {
  private updateWebTrigger$ = new Subject<void>();
  private updateAdminTrigger$ = new Subject<void>();
  private updateServeTrigger$ = new Subject<void>();
  constructor(
    private readonly systemService: SystemService,
    private readonly mutexService: MutexService,
  ) {}

  @Public()
  @Sse('test')
  handleUpdate(): Observable<MessageEvent> {
    return interval(1000).pipe(map((_) => ({ data: 'hello world' })));
  }

  @Sse('update/web')
  handleUpdateWeb(): Observable<MessageEvent> {
    this.systemService.updateWeb();
    return this.updateWebTrigger$.pipe(
      map((params) => ({
        data: params as any,
      })),
    );
  }
  @OnEvent(EventsEnum.UPDATE_WEB_MSG)
  handleUpdateWebTrigger(params: any) {
    this.updateWebTrigger$.next(params);
  }

  @Sse('update/admin')
  handleUpdateAdmin(): Observable<MessageEvent> {
    this.systemService.updateAdmin();
    return this.updateAdminTrigger$.pipe(
      map((params) => ({
        data: params as any,
      })),
    );
  }
  @OnEvent(EventsEnum.UPDATE_ADMIN_MSG)
  handleUpdateAdminTrigger(params: any) {
    this.updateAdminTrigger$.next(params);
  }

  @Sse('update/serve')
  handleUpdateServe(): Observable<MessageEvent> {
    this.systemService.updateServe();
    return this.updateServeTrigger$.pipe(
      map((params) => ({
        data: params as any,
      })),
    );
  }
  @OnEvent(EventsEnum.UPDATE_SERVE_MSG)
  handleUpdateServeTrigger(params: any) {
    this.updateServeTrigger$.next(params);
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
      await new Promise((resolve) => setTimeout(resolve, 10000));

      console.log('锁中任务执行完成!');

      return 'Hello world!';
    });

    return result;
  }
}
