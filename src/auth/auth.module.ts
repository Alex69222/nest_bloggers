import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { BasicStrategy } from './strategies/auth-basic.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersRepository } from '../users/users.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/entities/user.entity';
import { HashManager } from '../managers/hashManager';

@Module({
  imports: [
    PassportModule,
    ConfigModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [BasicStrategy, AuthService, UsersRepository, HashManager],
  controllers: [AuthController],
})
export class AuthModule {}
