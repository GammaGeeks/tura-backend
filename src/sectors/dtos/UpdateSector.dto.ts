import { IsString, IsInt, IsOptional } from 'class-validator';

export class UpdateSectorDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsInt()
  @IsOptional()
  districtId?: number;
}
