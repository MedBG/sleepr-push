import { Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './users/guards/local-auth.guard';
import { CurrentUser,UserDocument } from '@app/common';
import { Response } from "express"
import { MessagePattern, Payload } from '@nestjs/microservices';
import { JwtAuthGuard } from './users/guards/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users/users.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
     private readonly usersService: UsersService,
        private readonly jwtService: JwtService
  ) { }


  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @CurrentUser() user: UserDocument,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.login(user, response);
    response.send(user);
    // return user
  }
  // @UseGuards(JwtAuthGuard)
  // @MessagePattern('authenticate')
  // async authenticate(@Payload() data: any) {
  //   console.log(data)

  //   return data.user;
  // }

// @UseGuards(JwtAuthGuard)
 @MessagePattern('authenticate')
  async authenticate(@Payload() data: any) {
    const token = data.Authentication;
    if (!token) return null;

    try {
      const payload = this.jwtService.verify(token); // <- décode le JWT
      const user = await this.usersService.getUser({ _id: payload.userId });
      return user;
    } catch (err) {
      console.error('[AUTH ERROR] JWT invalid or user not found', err);
      return null;
    }
  }
}
