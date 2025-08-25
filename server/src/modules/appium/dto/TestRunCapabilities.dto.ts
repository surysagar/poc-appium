import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, ValidateIf } from 'class-validator';

export class TestRunCapabilitiesDto {
  @ApiPropertyOptional({
    description:
      'The app activity for Android devices. Required if appPackage is provided.',
  })
  @ValidateIf((o) => !o.bundleId && o.appPackage)
  @IsString()
  appActivity: string;

  @ApiPropertyOptional({
    description:
      'The app package for Android devices. Required if appActivity is provided.',
  })
  @ValidateIf((o) => !o.bundleId && o.appActivity)
  @IsString()
  appPackage: string;

  @ApiPropertyOptional({
    description:
      'The bundle ID for iOS devices. Must not be provided if appActivity and appPackage are present.',
  })
  @ValidateIf((o) => !o.appActivity && !o.appPackage)
  @IsString()
  bundleId: string;

  @ApiPropertyOptional({
    description:
      'The xcodeOrg ID for iOS developer. Must not be provided if appActivity and appPackage are present.',
  })
  @ValidateIf((o) => !o.appActivity && !o.appPackage)
  @IsString()
  xcodeOrgId: string;
}
