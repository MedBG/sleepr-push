import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { DatabaseModule, LoggerModule, AUTH_SERVICE, JwtAuthGuard, PAYMENTS_SERVICE } from '@app/common';
import { ReservationsRepository } from './reservations.repository';
import { ReservationDocument, ReservationSchema } from './models/reservations.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import * as  path from 'path';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.resolve(process.cwd(), 'apps/reservations/.env'),
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().uri().required(),
        PORT: Joi.number().required(),
        AUTH_HOST: Joi.string().required(),
        PAYMENTS_HOST: Joi.string().required(),
        PAYMENTS_PORT: Joi.number().required(),
      })
    }),
    DatabaseModule,
    DatabaseModule.forFeature([{
      name: ReservationDocument.name, schema: ReservationSchema
    },]),
    LoggerModule,
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('AUTH_HOST') || 'auth',
            port: configService.get('AUTH_PORT') || 3002,
          },
        }),
        inject: [ConfigService]
      },
      {
        name: PAYMENTS_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('PAYMENTS_HOST') || 'payments',
            port: configService.get('PAYMENTS_PORT') || 3003,
          },
        }),
        inject: [ConfigService]
      }
    ]),
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService, ReservationsRepository, JwtAuthGuard],
})
export class ReservationsModule {

  constructor(configService: ConfigService) {
    console.log('[ENV-CONFIG] MONGODB_URI =', configService.get('MONGODB_URI'));
    console.log('[ENV-CONFIG] PORT =', configService.get('PORT'));
    console.log(' AUTH_PORT=', configService.get('AUTH_PORT'));
    console.log(' AUTH_HOST=', configService.get('AUTH_HOST'));
       console.log(' PAYMENTS_PORT=', configService.get('PAYMENTS_PORT'));
    console.log(' APAYMENTS_HOST=', configService.get('PAYMENTS_HOST'))
  }
}
