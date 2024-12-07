// src/blogs/dtos/create-blog.dto.ts
import { IsString, IsNumber, IsOptional, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBlogDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  categoryId?: any;

  @IsOptional()
  @IsUrl()
  featuredImg?: string;

  @IsOptional()
  @IsString()
  slug?: string;
}
