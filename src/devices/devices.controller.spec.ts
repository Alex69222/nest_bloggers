import { Test, TestingModule } from '@nestjs/testing';
import { DevicesController } from './devices.controller';
import { DevicesService } from './devices.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/entities/user.entity';
import { UsersRepository } from '../users/users.repository';
import { DevicesRepository } from './devices.repository';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../test/mongo-memory-server';

describe('DevicesController', () => {
  let controller: DevicesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        rootMongooseTestModule(),
      ],
      controllers: [DevicesController],
      providers: [DevicesService, UsersRepository, DevicesRepository],
    }).compile();

    controller = module.get<DevicesController>(DevicesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  // it('should return unauthorized error', async () => {
  //   const result = await controller.findAll({
  //     user: { userId: '641e9e39f6ce51c4726df9e6' },
  //   });
  //   console.log(result);
  //   expect(result).toBe('2');
  // });
  afterAll(async () => {
    await closeInMongodConnection();
  });
});
