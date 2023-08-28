import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config'
import configuration from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './config/typeORM.config.service';
import { CommonModule } from './shared/common.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        '.env',
        process.env.NODE_ENV === 'development' ? '.env.dev' : '.env.prod',
      ],
      isGlobal: true,
      cache: true,
      load: [configuration]
    }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    CommonModule
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }
