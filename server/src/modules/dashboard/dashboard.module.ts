import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DashboardService } from './services/dashboard.service';
import { DashboardController } from './controllers/dashboard.controller';
import { Device, DeviceSchema } from 'src/modules/devices/schemas/device.schema';
import { TestScript, TestScriptSchema } from 'src/modules/test-scripts/schemas/test-script.schema';
import { TestRun, TestRunSchema } from 'src/modules/test-runs/schemas/test-run.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Device', schema: DeviceSchema },
      { name: 'TestScript', schema: TestScriptSchema },
      { name: 'TestRun', schema: TestRunSchema },
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
