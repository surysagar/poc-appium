import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DeviceStatusEnum } from 'src/modules/devices/enums/deviceStatus.enum';
import { RandomNumberGenerator } from 'utils/RandomNumberGenerator/randomNumbergenerator';
import { TestStatusEnum } from '../enums/testStatus.enum';

// Define the Mongoose schema using @Schema decorator
@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  collection: 'TestRun',
})
export class TestRun extends Document {
  @Prop({ default: () => RandomNumberGenerator.getUniqueId() })
  _id: string;

  @Prop({ required: true, index: true })
  device_id: string;

  @Prop({})
  script_name?: string;

  @Prop({ default: TestStatusEnum.INPROGRESS, index: true })
  status: string;

  @Prop({ index: true })
  session_id: string;

  @Prop({ type: Object })
  capabilities: any;

  @Prop({ index: true })
  port: string;

  @Prop({ type: Object })
  result: any;

  @Prop({})
  created_by: string;

  // Automatically managed by Mongoose due to timestamps: true
  createdAt: Date;
  updatedAt: Date;
}

// Schema factory for creating Mongoose schema from the class
export const TestRunSchema = SchemaFactory.createForClass(TestRun);

// Pre-save hook to set ID if it's not already set
TestRunSchema.pre<TestRun>('save', function (next) {
  if (!this._id) {
    this._id = RandomNumberGenerator.getUniqueId();
  }
  next();
});

export const CollectionName = 'TestRun';
