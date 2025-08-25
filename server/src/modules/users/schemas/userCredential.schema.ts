import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { RandomNumberGenerator } from 'utils/RandomNumberGenerator/randomNumbergenerator';

// Define the Mongoose schema using @Schema decorator
@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  collection: 'UserCredential',
})
export class UserCredential extends Document {
  @Prop({ default: () => RandomNumberGenerator.getUniqueId() })
  _id: string;

  @Prop({ required: true, index: true, unique: true })
  user_id: string;

  @Prop({ required: true, index: true, unique: true })
  user_name: string;

  @Prop({ required: true })
  password: string;

  // Automatically added by Mongoose with timestamps: true
  createdAt: Date;
  updatedAt: Date;
}

// Schema factory for creating Mongoose schema from the class
export const UserCredentialSchema =
  SchemaFactory.createForClass(UserCredential);

// Pre-save hook to set ID and timestamps
UserCredentialSchema.pre('save', function (next) {
  const now = new Date();
  const document = this as UserCredential;

  if (!document._id) {
    document._id = RandomNumberGenerator.getUniqueId();
  }
  document.updatedAt = now;

  if (!document.createdAt) {
    document.createdAt = now;
  }

  next();
});

export const CollectionName = 'UserCredential';
