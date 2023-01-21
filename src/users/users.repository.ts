import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './entities/user.entity';
import { isValidObjectId, Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { idMapper } from '../helpers/id-mapper';
import { OutputUserDto } from './dto/output-user.dto';
import { Injectable } from '@nestjs/common';
import { QueryType } from '../helpers/queryHandler';
import {
  PaginationViewType,
  transformToPaginationView,
} from '../helpers/transformToPaginationView';
@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async create(createUserDto: CreateUserDto): Promise<OutputUserDto> {
    const createdUser = new this.userModel({
      ...createUserDto,
      createdAt: new Date().toISOString(),
    });
    try {
      await createdUser.save();
      const { password, ...resultUser } = idMapper(createdUser.toObject());
      return resultUser;
    } catch (e) {
      console.log(e);
    }
  }
  async findAll(query: QueryType): Promise<PaginationViewType<OutputUserDto>> {
    const totalCount = await this.userModel.count({
      $or: [
        { login: { $regex: query.searchLoginTerm, $options: '-i' } },
        { email: { $regex: query.searchEmailTerm, $options: '-i' } },
      ],
    });
    const users = await this.userModel
      .find(
        {
          $or: [
            { login: { $regex: query.searchLoginTerm, $options: '-i' } },
            { email: { $regex: query.searchEmailTerm, $options: '-i' } },
          ],
        },
        { password: 0 },
      )
      .sort([[query.sortBy, query.sortDirection === 'asc' ? 1 : -1]])
      .skip(query.pageSize * (query.pageNumber - 1))
      .limit(query.pageSize)
      .lean();
    return transformToPaginationView<OutputUserDto>(
      totalCount,
      query.pageSize,
      query.pageNumber,
      idMapper(users),
    );
  }
  async findByLoginOrEmail(
    loginOrEmail: string,
  ): Promise<CreateUserDto | null> {
    const user = await this.userModel
      .findOne({
        $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
      })
      .lean();
    return idMapper(user);
  }
  async remove(id: string): Promise<boolean> {
    if (!isValidObjectId(id)) return false;
    const deletedUser = await this.userModel.findByIdAndDelete(id);
    console.log(deletedUser);
    if (!deletedUser) return false;
    return true;
  }
}
