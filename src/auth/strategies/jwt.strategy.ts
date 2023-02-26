import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'test',
    });
  }

  async validate(payload: { sub: number; login: string }) {
    const data = {
      id: payload.sub,
      login: payload.login,
    };

    const user = await this.userService.findByCond(data);

    if (!user) throw new UnauthorizedException('Нет доступа к данной странице');

    return {
      id: user.userId,
      login: user.login,
      name: user.name,
      surname: user.surname,
      birthDate: user.birthDate,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
    };
  }
}
