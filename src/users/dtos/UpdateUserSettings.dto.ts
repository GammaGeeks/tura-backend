import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateUserSettingsDto {
  @IsOptional()
  @IsBoolean()
  notificationsOn?: boolean;

  @IsOptional()
  @IsBoolean()
  smsEnabled?: boolean;
}
