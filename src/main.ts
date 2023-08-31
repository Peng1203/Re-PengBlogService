import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import session from 'express-session';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptor';
import { DtoValidatePipe } from './common/pipe';
import { HttpExceptionFilter, DataAccessFilter } from './common/exceptions';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const APP_HOST = configService.get<string>('APP_HOST');
  const APP_PORT = configService.get<string>('APP_PORT');
  const SESSION_SECRET = configService.get<string>('SESSION_SECRET');
  const SWAGGER_PREFIX = configService.get<string>('SWAGGER_PREFIX');
  const SWAGGER_VERSION = configService.get<string>('SWAGGER_VERSION');
  const SWAGGER_TITLE = configService.get<string>('SWAGGER_TITLE');

  app.use(
    session({
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    }),
  );

  app.enableCors()

  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalPipes(new DtoValidatePipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalFilters(new DataAccessFilter());

  const options = new DocumentBuilder()
    .setTitle(SWAGGER_TITLE)
    // .setDescription('博客接口示例')
    .setVersion(SWAGGER_VERSION)
    // .addTag('cats')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(SWAGGER_PREFIX, app, document);

  await app.listen(APP_PORT, APP_HOST, () =>
    console.log(
      `server is running: http://${APP_HOST}:${APP_PORT}  --${process.env.NODE_ENV}`,
    ),
  );
}
bootstrap();
