import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ConfigType } from '../../config/configuration';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService<ConfigType>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('tokenSettings', { infer: true })
        .jwtSecret,
    });
  }
  async validate(payload: any) {
    return {
      userId: payload.sub,
      userName: payload.userName,
      deviceId: payload.deviceId,
    };
  }
}
