import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDefined, IsOptional, IsString } from 'class-validator';
import { TestRunCapabilitiesDto } from 'src/modules/appium/dto/TestRunCapabilities.dto';

export class CreateTestRunDto {
  @ApiProperty({
    description: 'Unique identifier of the device',
    example: 'device12345',
    required: true,
  })
  @IsString()
  @IsDefined()
  device_id: string;

  @ApiProperty({
    description: 'Unique identifier of the script to be executed',
    example: 'script12345',
    required: true,
  })
  @IsString()
  @IsDefined()
  script_id: string;

  @ApiProperty({
    description: 'Unique identifier of the APK to be tested',
    required: false,
  })
  @IsString()
  @IsOptional()
  apk_id: string;

  @ApiPropertyOptional({
    description: 'Capabilities required for the test run',
    type: TestRunCapabilitiesDto,
    example: {
      appActivity: 'com.example.MainActivity',
      appPackage: 'com.example',
    },
  })
  @IsOptional()
  capabilities?: TestRunCapabilitiesDto;
}
