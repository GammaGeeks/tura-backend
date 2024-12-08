import { IsString, IsOptional } from 'class-validator';

export class UpdateCategoryDto {
  @IsOptional() // Make it optional so that it can be omitted during updates
  @IsString() // Ensure the 'name' is a string if provided
  name?: string;

  @IsOptional() // Makes 'details' optional
  @IsString() // Ensures 'details' is a string, if provided
  details?: string;
}
