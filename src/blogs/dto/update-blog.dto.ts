import { PartialType } from '@nestjs/mapped-types';
import { CreateBlogDto } from './create-blog.dto';
import { IsNotEmpty, IsString, IsUrl, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { trimValidatedString } from '../../helpers/validation-helpers';

export class UpdateBlogDto {
  @MaxLength(15)
  @IsNotEmpty()
  @Transform(trimValidatedString)
  @IsString()
  name: string;
  @MaxLength(100)
  @IsUrl()
  youtubeUrl: string;
}
