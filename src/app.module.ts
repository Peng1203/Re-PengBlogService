import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { RoleModule } from './modules/role/role.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtAuthGuard } from './modules/auth/guards';
import { JwtStrategy } from './modules/auth/strategys';
import { CommonModule } from './shared/common.module';
import { TransformInterceptor } from './common/interceptor';
import { RoleGuard } from './common/guards';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', process.env.NODE_ENV === 'development' ? '.env.dev' : '.env.prod'],
      isGlobal: true,
      cache: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    AuthModule,
    UserModule,
    RoleModule,
    CommonModule,
  ],
  providers: [
    JwtStrategy,
    // 全局JWT守卫
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // 全局角色守卫
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
    // 全局响应拦截器
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}
