import { IsString, IsNumber, IsOptional, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePlaceDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsUrl()
  featuredImg?: string;

  @IsNumber()
  @Type(() => Number)
  sectorId: any;
}
