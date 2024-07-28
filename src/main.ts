import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './auth/global-filters/http-exception.filter';
import { AllExceptionsFilter } from './auth/global-filters/all-exception.filter';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('RABBITMQ_URL')],
      queue: configService.get<string>('RABBITMQ_QUEUE'),
      queueOptions: {
        durable: configService.get<boolean>('RABBITMQ_QUEUE_DURABLE'),
      },
    },
  });
  app.startAllMicroservices();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  const port = configService.get<number>('APP_PORT');
  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(
    new HttpExceptionFilter(configService),
    new AllExceptionsFilter(httpAdapterHost),
  );
  await app.listen(port);
}
bootstrap();
