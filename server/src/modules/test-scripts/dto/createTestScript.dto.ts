// createTestScript.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsArray, IsOptional } from 'class-validator';
import { ScriptTypeEnum } from 'src/modules/appium/enums/scriptType.enum';

export class CreateTestScriptDto {
  @ApiProperty({ description: 'Name of the test script' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Name of the test script' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Type of the test script', enum: ScriptTypeEnum })
  @IsEnum(ScriptTypeEnum)
  test_type: ScriptTypeEnum;

  @ApiProperty({ description: 'Unique identifier for the script' })
  @IsString()
  script_id: string;

  @ApiProperty({
    description: 'List of step file IDs',
    type: [String],
    required: false,
  })
  @IsArray()
  @IsOptional()
  step_file_ids?: string[];
}
