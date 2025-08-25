import { Module } from '@nestjs/common';
import { TestScriptsController } from './controllers/test-scripts.controller';
import { TestScriptsService } from './services/test-scripts.service';
import {
  TestScriptSchema,
  CollectionName as TestScriptCollectionName,
} from './schemas/test-script.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentModule } from '../document/document.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TestScriptCollectionName, schema: TestScriptSchema },
    ]),
    DocumentModule,
  ],
  controllers: [TestScriptsController],
  providers: [TestScriptsService],
  exports: [TestScriptsService],
})
export class TestScriptsModule {}
