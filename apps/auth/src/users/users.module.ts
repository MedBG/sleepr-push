import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AUTH_SERVICE, DatabaseModule, JwtAuthGuard } from '@app/common';
import { UserDocument, UserSchema } from '@app/common';
import { UsersRepository } from './users.repository';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Module({
  imports:[DatabaseModule, 
      DatabaseModule.forFeature([{
        name: UserDocument.name, schema: UserSchema
      },]),
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
      inject: [ConfigService],
    },
  ]),],
  controllers: [UsersController],
  providers: [UsersService,UsersRepository,JwtAuthGuard],
  exports:[UsersService]
})
export class UsersModule {}
