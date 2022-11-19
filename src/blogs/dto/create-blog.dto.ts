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
  @MaxLength(500)
  @IsNotEmpty()
  @Transform(trimValidatedString)
  @IsString()
  description: string;
  @IsUrl()
  @MaxLength(100)
  websiteUrl: string;
}
