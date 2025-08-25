import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { RandomNumberGenerator } from 'utils/RandomNumberGenerator/randomNumbergenerator';

// Define the Mongoose schema using @Schema decorator
@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  collection: 'Document',
})
export class Documents extends Document {
  @Prop({ default: () => RandomNumberGenerator.getUniqueId() })
  _id: string;

  @Prop({ required: true, index: true })
  name: string;

  @Prop({ required: true })
  doc_type: string;

  @Prop({ required: true })
  path: string;

  @Prop({ required: true })
  uploaded_by: string;

  // Automatically added by Mongoose with timestamps: true
  createdAt: Date;
  updatedAt: Date;
}

// Schema factory for creating Mongoose schema from the class
export const DocumentsSchema = SchemaFactory.createForClass(Documents);

// Pre-save hook to set ID and timestamps
DocumentsSchema.pre<Documents>('save', function (next) {
  if (!this._id) {
    this._id = RandomNumberGenerator.getUniqueId();
  }
  next();
});

export const CollectionName = 'Document';
