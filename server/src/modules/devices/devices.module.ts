import { Module } from '@nestjs/common';
import { DevicesController } from './controllers/devices.controller';
import { DeviceService } from './services/device.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  DeviceSchema,
  CollectionName as DeviceCollectionName,
} from './schemas/device.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DeviceCollectionName, schema: DeviceSchema },
    ]),
  ],
  controllers: [DevicesController],
  providers: [DeviceService],
  exports: [DeviceService],
})
export class DevicesModule {}
