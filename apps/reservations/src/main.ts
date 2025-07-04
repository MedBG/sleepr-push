import { NestFactory } from '@nestjs/core';
import { ReservationsModule } from './reservations.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser'


async function bootstrap() {
  const app = await NestFactory.create(ReservationsModule);
  const configService= app.get(ConfigService)

  app.useGlobalPipes(new ValidationPipe({whitelist:true}));
  app.useLogger(app.get(Logger))
  app.use(cookieParser());
  
  const port = configService.get<number>('PORT')  || 3000;
  await app.listen(port) ;

}
bootstrap();
