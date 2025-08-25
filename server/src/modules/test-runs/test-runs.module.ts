import { forwardRef, Module } from '@nestjs/common';
import { TestRunController } from './controllers/test-run.controller';
import { TestRunService } from './services/test-run.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  TestRunSchema,
  CollectionName as TestRunCollectionName,
} from './schemas/test-run.schema';
import { AppiumModule } from '../appium/appium.module';
import { DevicesModule } from '../devices/devices.module';
import { TestScriptsModule } from '../test-scripts/test-scripts.module';
import { DocumentModule } from '../document/document.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    forwardRef(() => AppiumModule),
    DevicesModule,
    TestScriptsModule,
    DocumentModule,
    UsersModule,
    MongooseModule.forFeature([
      { name: TestRunCollectionName, schema: TestRunSchema },
    ]),
  ],
  controllers: [TestRunController],
  providers: [TestRunService],
  exports: [TestRunService],
})
export class TestRunsModule {}
