import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { OutputPostDto } from './dto/output-post.dto';
import { Post, PostDocument } from './entities/post.entity';
import mongoose, { isValidObjectId, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { idMapper } from '../helpers/id-mapper';

const returnNameFromPopulation = (doc) => doc.name;

@Injectable()
export class PostsRepository {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}
  async create(createPostDto: CreatePostDto): Promise<OutputPostDto> {
    const createdPost = new this.postModel({
      ...createPostDto,
      blogName: createPostDto.blogId,
    });
    await createdPost.save();
    await createdPost.populate({
      path: 'blogName',
      transform: returnNameFromPopulation,
    });
    return idMapper(createdPost.toObject());
  }

  async findAll(): Promise<OutputPostDto[]> {
    const posts = await this.postModel
      .find()
      .populate({
        path: 'blogName',
        transform: returnNameFromPopulation,
      })
      .lean();
    return idMapper(posts);
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
