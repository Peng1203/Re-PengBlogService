import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config'
import configuration from './config/configuration';

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
    })
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }
