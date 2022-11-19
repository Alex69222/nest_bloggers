import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';
import { IsNotEmpty, IsString, MaxLength, Validate } from 'class-validator';
import { Transform } from 'class-transformer';
import { trimValidatedString } from '../../helpers/validation-helpers';
import { BlogExistsValidator } from '../../validators/blog-exists-validator';

export class UpdatePostDto extends CreatePostDto {}
