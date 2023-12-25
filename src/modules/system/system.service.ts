import { spawn } from 'child_process';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventsEnum } from '@/helper/enums';
import path from 'path';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SystemService {
  private SCRIPT_ROOT_PATH = path.resolve(process.cwd(), 'src', 'script', 'update');
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly configService: ConfigService,
  ) {}

  /** 更新系统服务 */
  async updateSystem(serveName: string) {
    const { scriptPath, cwd } = this.getUpdateServeNameInfo(serveName);

    let childProcess =
      process.platform === 'win32'
        ? spawn(scriptPath, { cwd })
        : spawn('chmod', ['+x', scriptPath], { cwd });

    childProcess.stdout.on('data', (data: Buffer) => {
      console.log('stdout ------', `${data}`);
      this.eventEmitter.emit(EventsEnum.UPDATE_SYSTEM_MSG, {
        data: data.toString('utf-8'),
        status: 'In execute',
      });
    });

    childProcess.stderr.on('data', (err) => {
      console.log('stderr ------', `${err}`);
      this.eventEmitter.emit(EventsEnum.UPDATE_SYSTEM_MSG, {
        data: `${err}`,
        status: 'error',
      });
    });

    childProcess.on('close', (status) => {
      console.log('close ------', `${status}`);
      this.eventEmitter.emit(EventsEnum.UPDATE_SYSTEM_MSG, {
        data: `更新结束!`,
        status: 'Success',
      });

      this.eventEmitter.emit(EventsEnum.UPDATE_SYSTEM_COMPLETED);
    });
  }

  private getUpdateServeNameInfo(serveName: string) {
    switch (serveName) {
      case 'web':
        return {
          scriptPath: path.resolve(this.SCRIPT_ROOT_PATH, 'web', this.runScriptAdapter()),
          cwd: this.configService.get<string>('WEB_PROJECT_DIR'),
        };
      case 'admin':
        return {
          scriptPath: path.resolve(this.SCRIPT_ROOT_PATH, 'admin', this.runScriptAdapter()),
          cwd: this.configService.get<string>('ADMIN_PROJECT_DIR'),
        };
      case 'serve':
        return {
          scriptPath: path.resolve(this.SCRIPT_ROOT_PATH, 'serve', this.runScriptAdapter()),
          cwd: this.configService.get<string>('SERVE_PROJECT_DIR'),
        };
    }
  }

  private runScriptAdapter(): string {
    return process.platform === 'win32' ? 'index.bat' : 'index.sh';
  }
}
