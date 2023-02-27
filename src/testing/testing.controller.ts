import { Controller, Delete, HttpStatus, HttpCode } from '@nestjs/common';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
const url = process.env.MONGOOSE_URI;

@Controller('testing')
export class TestingController {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/all-data')
  async clearDB() {
    try {
      await this.connection.db.dropDatabase();
      return;
    } catch (e) {
      console.log(e);
    }
  }
}
