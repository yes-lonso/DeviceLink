import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PUERTO');
  await app.listen(port);

  const logger = new Logger('Bootstrap');
  logger.log(`DeviceLink ejecutándose en el puerto ${port}`);
}
bootstrap();
