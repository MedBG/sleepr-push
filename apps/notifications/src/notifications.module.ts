import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import * as  path from 'path';
import { LoggerModule, NOTIFICATIONS_SERVICE } from '@app/common';
import { ClientsModule, Transport } from '@nestjs/microservices'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.resolve(process.cwd(), 'apps/notifications/.env'),
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        GOOGLE_OAUTH_CLIENT_ID: Joi.string().required(),
        GOOGLE_OAUTH_CLIENT_SECRET: Joi.string().required(),
        GOOGLE_OAUTH_REFRESH_TOKEN: Joi.string().required(),
        SMTP_USER: Joi.string().required(),

      })
    }),
    LoggerModule,
    // ClientsModule.registerAsync([
    //   {
    //     name: NOTIFICATIONS_SERVICE,
    //     useFactory: (configService: ConfigService) => ({
    //       transport: Transport.TCP,
    //       options: {
    //         host: configService.get('NOTIFICATIONS_HOST') || 'NOTIFICATIONS',
    //         port: configService.get('NOTIFICATIONS_PORT') || 3004,
    //       },
    //     }),
    //     inject: [ConfigService]
    //   },

    // ]),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule { 
  constructor(configService: ConfigService) {
      console.log('GOOGLE_OAUTH_CLIENT_ID =', configService.get('GOOGLE_OAUTH_CLIENT_ID'));
      console.log('GOOGLE_OAUTH_CLIENT_SECRET =', configService.get('GOOGLE_OAUTH_CLIENT_SECRET'));
      console.log('GOOGLE_OAUTH_REFRESH_TOKEN =', configService.get('GOOGLE_OAUTH_REFRESH_TOKEN'));


     
    }
}
