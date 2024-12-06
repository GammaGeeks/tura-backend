import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  IsArray,
} from 'class-validator';

export class UpdatePropertyDto {
  @IsInt()
  @IsOptional()
  userId?: number;

  @IsString()
  @IsOptional()
  title?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  imageUrls?: string[];

  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsOptional()
  details?: string;

  @IsInt()
  @IsOptional()
  price?: number;

  @IsInt()
  @IsOptional()
  categoryId?: number;

  @IsInt()
  @IsOptional()
  size?: number;

  @IsBoolean()
  @IsOptional()
  hasParking?: boolean;

  @IsBoolean()
  @IsOptional()
  isForSale?: boolean;

  @IsBoolean()
  @IsOptional()
  isForRent?: boolean;

  @IsInt()
  @IsOptional()
  placeId?: number;

  @IsInt()
  @IsOptional()
  bedrooms?: number;

  @IsInt()
  @IsOptional()
  bathrooms?: number;

  @IsBoolean()
  @IsOptional()
  isSold?: boolean;

  @IsBoolean()
  @IsOptional()
  hasPool?: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  appliances?: string[];

  @IsDateString()
  @IsOptional()
  yearBuilt?: Date;

  @IsBoolean()
  @IsOptional()
  AC?: boolean;

  @IsString()
  @IsOptional()
  YTUrl?: string;
}
