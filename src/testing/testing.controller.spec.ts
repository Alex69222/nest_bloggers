import { Test, TestingModule } from '@nestjs/testing';
import { TestingController } from './testing.controller';
import { TestingService } from './testing.service';
import { Connection } from 'mongoose';

import { rootMongooseTestModule } from '../../test/mongo-memory-server';

describe('TestingController', () => {
  let controller: TestingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [rootMongooseTestModule()],
      controllers: [TestingController],
      providers: [TestingService, Connection],
    }).compile();

    controller = module.get<TestingController>(TestingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
