import { exec, spawn } from 'child_process';
import { promisify } from 'util';
import { Injectable, Logger } from '@nestjs/common';
import { CreateSystemDto } from './dto/create-system.dto';
import { UpdateSystemDto } from './dto/update-system.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventsEnum } from '@/helper/enums/events';
import path from 'path';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SystemService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly configService: ConfigService,
  ) {}

  private SCRIPT_ROOT_PATH = path.resolve(process.cwd(), 'src', 'script', 'update');
  // private readonly WEB_UPDATE_COMMANDS = [
  //   'cd',
  //   'git status',
  //   'git pull',
  //   'pnpm i',
  //   'pnpm run build',
  // ];
  // private readonly execPromise = promisify(exec);

  /** 更新Web服务 */
  async updateWeb() {
    const scriptPath = path.resolve(this.SCRIPT_ROOT_PATH, 'web', this.runScriptAdapter());

    let childProcess = spawn(scriptPath, {
      cwd: this.configService.get<string>('WEB_PROJECT_DIR'),
      shell: process.platform !== 'win32',
    });

    childProcess.stdout.on('data', (data) => {
      this.eventEmitter.emit(EventsEnum.UPDATE_WEB_MSG, {
        data: `${data}`,
        status: 'In execute',
      });
    });

    childProcess.stderr.on('data', (err) => {
      this.eventEmitter.emit(EventsEnum.UPDATE_WEB_MSG, {
        data: `${err}`,
        status: 'error',
      });
    });

    childProcess.on('close', () => {
      this.eventEmitter.emit(EventsEnum.UPDATE_WEB_MSG, {
        data: `更新成功!`,
        status: 'Success',
      });
    });
  }

  /** 更新Admin web服务 */
  async updateAdmin() {
    const scriptPath = path.resolve(this.SCRIPT_ROOT_PATH, 'admin', this.runScriptAdapter());

    let childProcess = spawn(scriptPath, {
      cwd: this.configService.get<string>('ADMIN_PROJECT_DIR'),
      shell: process.platform !== 'win32',
    });

    childProcess.stdout.on('data', (data) => {
      this.eventEmitter.emit(EventsEnum.UPDATE_ADMIN_MSG, {
        data: `${data}`,
        status: 'In execute',
      });
    });

    childProcess.stderr.on('data', (err) => {
      this.eventEmitter.emit(EventsEnum.UPDATE_ADMIN_MSG, {
        data: `${err}`,
        status: 'error',
      });
    });

    childProcess.on('close', () => {
      this.eventEmitter.emit(EventsEnum.UPDATE_ADMIN_MSG, {
        data: `更新成功!`,
        status: 'Success',
      });
    });
  }

  /** 更新Serve服务 */
  async updateServe() {
    const scriptPath = path.resolve(this.SCRIPT_ROOT_PATH, 'serve', this.runScriptAdapter());

    let childProcess = spawn(scriptPath, {
      cwd: this.configService.get<string>('SERVE_PROJECT_DIR'),
      shell: process.platform !== 'win32',
    });

    childProcess.stdout.on('data', (data) => {
      this.eventEmitter.emit(EventsEnum.UPDATE_SERVE_MSG, {
        data: `${data}`,
        status: 'In execute',
      });
    });

    childProcess.stderr.on('data', (err) => {
      this.eventEmitter.emit(EventsEnum.UPDATE_SERVE_MSG, {
        data: `${err}`,
        status: 'error',
      });
    });

    childProcess.on('close', () => {
      this.eventEmitter.emit(EventsEnum.UPDATE_SERVE_MSG, {
        data: `更新成功!`,
        status: 'Success',
      });
    });
  }

  private runScriptAdapter(): string {
    return process.platform === 'win32' ? 'index.bat' : 'index.sh';
  }
}
