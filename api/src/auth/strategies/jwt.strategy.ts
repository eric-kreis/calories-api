import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RequestUserEntity } from '../entities/request-user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    readonly _configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: _configService.get('JWT_SECRET'),
    });
  }

  async validate({
    id,
    email,
    role,
    caloriesPerDay,
  }: RequestUserEntity): Promise<RequestUserEntity> {
    return {
      id,
      email,
      role,
      caloriesPerDay,
    };
  }
}
