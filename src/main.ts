import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import session from 'express-session';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptor/transform.interceptor';
import { DtoValidatePipe } from './common/pipe/dto-validate.pipe';
import { DataAccessFilter } from './common/exceptions/data-access.filter';
import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const APP_HOST = configService.get<string>('APP_HOST');
  const APP_PORT = configService.get<string>('APP_PORT');
  const SESSION_SECRET = configService.get<string>('SESSION_SECRET');

  app.use(
    session({
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    }),
  );

  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalPipes(new DtoValidatePipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalFilters(new DataAccessFilter());

  await app.listen(APP_PORT, APP_HOST, () =>
    console.log(
      `server is running: http://${APP_HOST}:${APP_PORT}  --${process.env.NODE_ENV}`,
    ),
  );
}
bootstrap();
