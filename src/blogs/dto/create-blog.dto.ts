import {
  IsNotEmpty,
  IsString,
  IsUrl,
  MaxLength,
  Validate,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { trimValidatedString } from '../../helpers/validation-helpers';

export class CreateBlogDto {
  @MaxLength(15)
  @IsNotEmpty()
  @Transform(trimValidatedString)
  @IsString()
  name: string;
  @MaxLength(100)
  @IsUrl()
  youtubeUrl: string;
}
