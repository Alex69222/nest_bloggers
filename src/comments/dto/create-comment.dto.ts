import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCommentDto {
  @MaxLength(300)
  @MinLength(20)
  @IsString()
  content: string;
}
