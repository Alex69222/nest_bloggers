import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { OutputPostDto } from './dto/output-post.dto';
import { Post, PostDocument } from './entities/post.entity';
import mongoose, { isValidObjectId, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { idMapper } from '../helpers/id-mapper';
import { QueryType } from '../helpers/queryHandler';
import {
  PaginationViewType,
  transformToPaginationView,
} from '../helpers/transformToPaginationView';
import { Blog } from '../blogs/entities/blog.entity';

const returnNameFromPopulation = (doc) => doc.name;

@Injectable()
export class PostsRepository {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(Blog.name) private blogModel: Model<PostDocument>,
  ) {}
  async create(createPostDto: CreatePostDto): Promise<OutputPostDto> {
    const createdPost = new this.postModel({
      ...createPostDto,
      createdAt: new Date().toISOString(),
      blogName: createPostDto.blogId,
    });
    await createdPost.save();
    await createdPost.populate({
      path: 'blogName',
      transform: returnNameFromPopulation,
    });
    return idMapper(createdPost.toObject());
  }

  async findAll(query: QueryType): Promise<PaginationViewType<OutputPostDto>> {
    console.log(query);
    const totalCount = await this.postModel.count({
      title: { $regex: query.searchNameTerm, $options: '-i' },
    });
    const posts = await this.postModel
      .aggregate([
        { $match: { title: { $regex: query.searchNameTerm, $options: '-i' } } },
        // { $skip: query.pageSize * (query.pageNumber - 1) },
        // { $limit: query.pageSize },
        {
          $lookup: {
            from: 'blogs',
            localField: 'blogName',
            foreignField: '_id',
            as: 'blogName',
          },
        },
        { $set: { blogName: '$blogName.name' } },
        // { $sort: [[query.sortBy, query.sortDirection === 'asc' ? 1 : -1]] },
      ])

      // .find({ name: { $regex: query.searchNameTerm, $options: '-i' } })
      // .populate({
      //   path: 'blogName',
      //   transform: returnNameFromPopulation,
      //   // select: 'name',
      //   // options: { sort: 'name' },
      // })

      // .sort([[query.sortBy, query.sortDirection === 'asc' ? 1 : -1]])

      .unwind({ path: '$blogName' })
      .sort({ [query.sortBy]: query.sortDirection })
      .skip(query.pageSize * (query.pageNumber - 1))
      .limit(query.pageSize)
      // .lean();
      .exec();
    return transformToPaginationView<OutputPostDto>(
      totalCount,
      query.pageSize,
      query.pageNumber,
      idMapper(posts),
    );
  }
  async findAllPostsForBlog(
    query: QueryType,
    id: string,
  ): Promise<PaginationViewType<OutputPostDto>> {
    const totalCount = await this.postModel.count({ blogId: id });
    const posts = await this.postModel
      .find({ blogId: id })
      .sort([[query.sortBy, query.sortDirection === 'asc' ? 1 : -1]])
      .skip(query.pageSize * (query.pageNumber - 1))
      .limit(query.pageSize)
      .populate({
        path: 'blogName',
        transform: returnNameFromPopulation,
      })
      .lean();
    return transformToPaginationView<OutputPostDto>(
      totalCount,
      query.pageSize,
      query.pageNumber,
      idMapper(posts),
    );
  }

  async findOne(id: string): Promise<OutputPostDto | null> {
    if (!isValidObjectId(id)) return null;
    const post = await this.postModel
      .findById(id)
      .populate({
        path: 'blogName',
        transform: returnNameFromPopulation,
      })
      .lean();
    return idMapper(post);
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<boolean> {
    if (!isValidObjectId(id)) return false;
    const post = await this.postModel.findById(id);
    if (!post) return false;
    post.title = updatePostDto.title;
    post.shortDescription = updatePostDto.shortDescription;
    post.content = updatePostDto.content;
    post.blogId = updatePostDto.blogId;
    await post.save();
    return true;
  }

  async remove(id: string): Promise<boolean> {
    if (!isValidObjectId(id)) return false;
    const deletedPost = await this.postModel.findByIdAndDelete(id);
    if (!deletedPost) return false;
    return true;
  }
}
