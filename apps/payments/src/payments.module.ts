import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import * as  path from 'path';
import { LoggerModule, NOTIFICATIONS_SERVICE } from '@app/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
      ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: path.resolve(process.cwd(), 'apps/paymets/.env'),

          validationSchema: Joi.object({
          
           PORT: Joi.number().required(),
           STRIPE_SECRET_KEY: Joi.string().required(),
           NOTIFICATIONS_HOST: Joi.string().required(),
           NOTIFICATIONS_PORT: Joi.number().required(),
          })
        }),
        LoggerModule,
            ClientsModule.registerAsync([
              {
                name: NOTIFICATIONS_SERVICE,
                useFactory: (configService: ConfigService) => ({
                  transport: Transport.TCP,
                  options: {
                    host: configService.get('NOTIFICATIONS_HOST') || 'NOTIFICATIONS',
                    port: configService.get('NOTIFICATIONS_PORT') || 3004,
                  },
                }),
                inject: [ConfigService]
              },
        
            ]),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {
   constructor(configService: ConfigService) {
      console.log('[ENV-CONFIG] PORT =', configService.get('PORT'));
     
    }
}
