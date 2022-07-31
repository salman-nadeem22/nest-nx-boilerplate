import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { projectConstants} from '@do-business/constants';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: configService.get<string>('RABBITMQ_URL', 'amqp://admin:admin@localhost:5682 ').split(' '),
      queue: projectConstants.ServicesClient.AUTH,
      noAck: true,
      queueOptions: {
        durable: false,
      },
    },
  });
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  await app.startAllMicroservices();
  Logger.log('AUTH Microservice has started...');
}
bootstrap();
