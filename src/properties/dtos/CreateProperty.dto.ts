import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsArray,
  IsDateString,
  Min,
  IsUrl,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';

// Connect input types
class ConnectInput {
  @IsInt()
  id: number;
}

// Nested DTOs for relations
class CategoryConnectInput {
  @Type(() => ConnectInput)
  connect: ConnectInput;
}

class PlaceConnectInput {
  @Type(() => ConnectInput)
  connect: ConnectInput;
}

class OwnerConnectInput {
  @Type(() => ConnectInput)
  connect: ConnectInput;
}

export class CreatePropertyDto {
  @IsString()
  @IsOptional()
  title: string;

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

  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @IsNumber()
  @Min(0)
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
  @Min(0)
  @IsOptional()
  bedrooms?: number;

  @IsInt()
  @Min(0)
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

  @IsUrl()
  @IsOptional()
  YTUrl?: string;

  @Type(() => OwnerConnectInput)
  owner: OwnerConnectInput;

  @Type(() => CategoryConnectInput)
  @IsOptional()
  category?: CategoryConnectInput;

  @Type(() => PlaceConnectInput)
  @IsOptional()
  place?: PlaceConnectInput;
}
