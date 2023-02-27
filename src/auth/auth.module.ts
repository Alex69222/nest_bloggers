import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BasicStrategy } from './strategies/auth-basic.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersRepository } from '../users/users.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/entities/user.entity';
import { HashManager } from '../managers/hashManager';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    ConfigModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwtSecret'),
        signOptions: {
          expiresIn: `${configService.get<string>('jwtExpirationTime')}`,
        },
      }),
    }),
  ],
  providers: [
    BasicStrategy,
    AuthService,
    UsersRepository,
    HashManager,
    JwtStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
