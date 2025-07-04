import { NestFactory } from '@nestjs/core';
import { NotificationsModule } from './notifications.module';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import {ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';


async function bootstrap() {
  const app = await NestFactory.create(NotificationsModule);
   const configService = app.get(ConfigService)
   app.connectMicroservice({
     transport: Transport.TCP,
     options: {
       host: '0.0.0.0',
       port: configService.get('PORT') || 3004
     }
   })
   app.useLogger(app.get(Logger));
   app.startAllMicroservices();
}
bootstrap();
