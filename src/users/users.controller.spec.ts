import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { HashManager } from '../managers/hashManager';
import { rootMongooseTestModule } from '../../test/mongo-memory-server';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { UsersRepository } from './users.repository';
import { ConfigService } from '@nestjs/config';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        rootMongooseTestModule(),
      ],
      controllers: [UsersController],
      providers: [UsersService, UsersRepository, HashManager, ConfigService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
