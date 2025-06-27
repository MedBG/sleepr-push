import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { UserDocument } from '@app/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from './interfaces/token-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtservice: JwtService

  ) { }

  login(user: UserDocument, response: Response) {

    const tokenPayload:TokenPayload = {
      userId: user._id.toHexString(),
    }
    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configService.get('JWT_EXPIRATION')
    );
    const token = this.jwtservice.sign(tokenPayload);
    response.cookie('Authentication', token, {
      httpOnly: true,
      expires,
    });

  }

}
