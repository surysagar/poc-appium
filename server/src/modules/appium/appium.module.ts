import { forwardRef, Module } from '@nestjs/common';
import { AppiumService } from './services/appium.service';
import { AppiumController } from './controllers/appium.controller';
import { TestRunsModule } from '../test-runs/test-runs.module';

@Module({
  imports: [forwardRef(() => TestRunsModule)],
  providers: [AppiumService],
  controllers: [AppiumController],
  exports: [AppiumService],
})
export class AppiumModule {}
