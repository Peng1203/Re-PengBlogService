import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtAuthGuard } from './modules/auth/guards';
import { JwtStrategy } from './modules/auth/strategys';
import { TransformInterceptor } from './common/interceptor';
import { RoleGuard, PermissionGuard } from './common/guards';
import { LoggerMiddleware, ResponseHeadersMiddleware } from './common/middleware';
import { CommonModule } from './shared/common.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { RoleModule } from './modules/role/role.module';
import { PermissionModule } from './modules/permission/permission.module';
import { MenuModule } from './modules/menu/menu.module';
import { ResourceModule } from './modules/resource/resource.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', process.env.NODE_ENV === 'development' ? '.env.dev' : '.env.prod'],
      isGlobal: true,
      cache: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    CommonModule,
    AuthModule,
    UserModule,
    RoleModule,
    PermissionModule,
    MenuModule,
    ResourceModule,
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
    // 全局权限守卫
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
    // 全局响应拦截器
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ResponseHeadersMiddleware, LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
