import { Module } from '@nestjs/common';
import { TestingService } from './testing.service';
import { TestingController } from './testing.controller';
import { Connection } from 'mongoose';

@Module({
  imports: [],
  controllers: [TestingController],
  providers: [TestingService, Connection],
})
export class TestingModule {}
