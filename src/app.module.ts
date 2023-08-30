import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { RoleModule } from './modules/role/role.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        '.env',
        process.env.NODE_ENV === 'development' ? '.env.dev' : '.env.prod',
      ],
      isGlobal: true,
      cache: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    AuthModule,
    UserModule,
    RoleModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }
