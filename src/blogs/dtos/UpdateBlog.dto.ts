// src/blogs/dtos/update-blog.dto.ts
import { IsString, IsNumber, IsOptional, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateBlogDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  categoryId?: number;

  @IsOptional()
  @IsUrl()
  featuredImg?: string;

  @IsOptional()
  @IsString()
  slug?: string;
}
