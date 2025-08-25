import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ScriptTypeEnum } from 'src/modules/appium/enums/scriptType.enum';
import { RandomNumberGenerator } from 'utils/RandomNumberGenerator/randomNumbergenerator';

// Define the Mongoose schema using @Schema decorator
@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  collection: 'TestScript',
})
export class TestScript extends Document {
  @Prop({ default: () => RandomNumberGenerator.getUniqueId() })
  _id: string;

  @Prop({ index: true })
  name?: string;

  @Prop({})
  description?: string;

  @Prop({ index: true, enum: ScriptTypeEnum })
  test_type: ScriptTypeEnum;

  @Prop({ index: true })
  script_id: string;

  @Prop({ index: true })
  added_by: string;

  @Prop({ type: [String] })
  step_file_ids?: string[];

  // Automatically managed by Mongoose due to timestamps: true
  createdAt: Date;
  updatedAt: Date;
}

// Schema factory for creating Mongoose schema from the class
export const TestScriptSchema = SchemaFactory.createForClass(TestScript);

// Pre-save hook to set ID if it's not already set
TestScriptSchema.pre<TestScript>('save', function (next) {
  if (!this._id) {
    this._id = RandomNumberGenerator.getUniqueId();
  }
  next();
});

export const CollectionName = 'TestScript';
