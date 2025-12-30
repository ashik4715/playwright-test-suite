import { IsString, MinLength, IsOptional } from 'class-validator';

export class UpdateBlogDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  title?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  content?: string;
}

