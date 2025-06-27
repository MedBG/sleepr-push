import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { UsersService } from "../src/users/users.service";
import { ConfigService } from "@nestjs/config";
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayload } from "../src/interfaces/token-payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(
        configService: ConfigService,
        private readonly usersService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: any) => {
                console.log("request",request)
                return request?.cookies?.Authentication || request?.isAuthenticated;
                },
            ]),
            secretOrKey: configService.get<string>('JWT_SECRET'),

        });
    }

    // async validate({ userId }: TokenPayload) {

    //     const user = this.usersService.getUser({ _id: userId });
    //     console.log('[JWT] Utilisateur trouvé', user);
    //     return user;
    // }
    async validate({ userId }: TokenPayload) {
    const user = await this.usersService.getUser({ _id: userId }); // <-- await ici obligatoire
    console.log('[JWT] Utilisateur trouvé', user);
    
    if (!user) {
        throw new UnauthorizedException();
    }

    return user; // injecté ensuite dans `request.user`
}



}