import {
  IsString,
  IsOptional,
  IsNumber,
  IsNotEmpty,
  IsEnum,
  ValidateIf,
} from 'class-validator';
import { ScriptTypeEnum } from '../enums/scriptType.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OperatingSystemEnum } from 'src/modules/devices/enums/operatingSystem.enum';
import { ReportTypeEnum } from '../enums/reportType.enum';
import { TestRunCapabilitiesDto } from './TestRunCapabilities.dto';

export class RunTestDto {
  @ApiProperty({
    description: 'Platform of the device, e.g., Android or iOS',
    enum: OperatingSystemEnum,
    example: 'Android',
  })
  @IsEnum(OperatingSystemEnum)
  @IsNotEmpty()
  platform: OperatingSystemEnum;

  @ApiProperty({
    description: 'Name or identifier of the device',
    example: 'emulator-5554',
  })
  @IsString()
  @IsNotEmpty()
  deviceName: string;

  @ApiProperty({
    description: 'Port number to connect to the device',
    example: 4725,
  })
  @IsNumber()
  @IsNotEmpty()
  port: number;

  @ApiProperty({
    description: 'Type of script to execute, either File or Inline',
    enum: ScriptTypeEnum,
    example: 'File',
  })
  @IsEnum(ScriptTypeEnum)
  @IsNotEmpty()
  scriptType: ScriptTypeEnum;

  @ApiPropertyOptional({
    description: 'Name of the script file, required if scriptType is "File"',
    example: 'test-script.js',
  })
  @ValidateIf((o) => o.scriptType === ScriptTypeEnum.FILE)
  @IsString()
  @IsNotEmpty()
  scriptName?: string;

  @ApiPropertyOptional({
    description: 'Id of the test suit, required if scriptType is "File"',
    example: 'test-script.js',
  })
  @ValidateIf((o) => o.scriptType === ScriptTypeEnum.FILE)
  @IsString()
  @IsNotEmpty()
  scriptId?: string;

  @ApiPropertyOptional({
    description: 'Inline script content, required if scriptType is "Inline"',
    example: 'console.log("Running test...")',
  })
  @ValidateIf((o) => o.scriptType === ScriptTypeEnum.INLINE)
  @IsString()
  @IsNotEmpty()
  script?: string;

  @ApiPropertyOptional({
    description: 'Path to the APK file, required for Android platform',
    example: '/path/to/app.apk',
  })
  @ValidateIf((o) => o.platform === OperatingSystemEnum.ANDROID)
  @IsString()
  @IsNotEmpty()
  apkFile?: string;

  @ApiPropertyOptional({
    description: 'Type of report to generate',
    enum: ReportTypeEnum,
    example: 'HTML',
  })
  @IsEnum(ReportTypeEnum)
  @IsOptional()
  reportType?: ReportTypeEnum;

  @ApiProperty({
    description: 'Test run identifier',
    example: 'xxx-xxxx-xxxx-xxxx',
  })
  @IsString()
  @IsNotEmpty()
  testId: string;

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
