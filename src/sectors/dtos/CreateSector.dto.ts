import { IsString, IsInt } from 'class-validator';

export class CreateSectorDto {
  @IsString()
  name: string;

  @IsInt()
  districtId: number;
}
