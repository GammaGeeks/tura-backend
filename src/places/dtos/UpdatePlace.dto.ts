import { IsString, IsNumber, IsOptional, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdatePlaceDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsUrl()
  featuredImg?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  sectorId?: number;
}
