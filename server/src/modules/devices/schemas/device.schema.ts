import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { RandomNumberGenerator } from 'utils/RandomNumberGenerator/randomNumbergenerator';
import { DeviceTypeEnum } from '../enums/deviceType.enum';
import { DeviceStatusEnum } from '../enums/deviceStatus.enum';

// Define the Mongoose schema using @Schema decorator
@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  collection: 'Device',
})
export class Device extends Document {
  @Prop({ default: () => RandomNumberGenerator.getUniqueId() })
  _id: string;

  @Prop({ required: true, index: true, unique: true })
  device_id: string;

  @Prop({ index: true, default: DeviceTypeEnum.MOBILE })
  device_type?: string;

  @Prop({})
  device_model?: string;

  @Prop({ index: true })
  os: string;

  @Prop({})
  os_version: string;

  @Prop({})
  port: string;

  @Prop({})
  status: DeviceStatusEnum;

  // Automatically added by Mongoose with timestamps: true
  createdAt: Date;
  updatedAt: Date;
}

// Schema factory for creating Mongoose schema from the class
export const DeviceSchema = SchemaFactory.createForClass(Device);

// Pre-save hook to set ID and timestamps
DeviceSchema.pre('save', function (next) {
  const now = new Date();
  const document = this as Device;

  if (!document._id) {
    document._id = RandomNumberGenerator.getUniqueId();
  }
  document.updatedAt = now;

  if (!document.createdAt) {
    document.createdAt = now;
  }

  next();
});

export const CollectionName = 'Device';
