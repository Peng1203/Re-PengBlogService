import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000, () => console.log(`server is running: http://127.0.0.1:3000  --${process.env.NODE_ENV}`));
}
bootstrap();
