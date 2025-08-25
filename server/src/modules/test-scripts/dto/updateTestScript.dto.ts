// updateTestScript.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateTestScriptDto } from './createTestScript.dto';

export class UpdateTestScriptDto extends PartialType(CreateTestScriptDto) {}
