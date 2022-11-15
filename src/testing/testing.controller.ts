import {
  Controller,
  Delete,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { TestingService } from './testing.service';
import mongoose from 'mongoose';
const url = process.env.MONGOOSE_URI;
@Controller('testing')
export class TestingController {
  @Delete('/all-data')
  async clearDB() {
    try {
      await mongoose.connect(
        'mongodb+srv://it-inc-db:6hAd5Ck2v3nrsVVm@it-inc-db.asa7p.mongodb.net/bloggers-2-0?retryWrites=true&w=majority',
      );
      await mongoose.connection.db.dropDatabase();
      return HttpStatus.OK;
    } catch (e) {
      console.log(e);
      throw new BadRequestException([
        {
          field: 'db',
          message: 'An error occurred during clearing DB',
        },
      ]);
    }
  }
}
