import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { RandomNumberGenerator } from 'utils/RandomNumberGenerator/randomNumbergenerator';

// Define the Mongoose schema using @Schema decorator
@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  collection: 'User',
})
export class User extends Document {
  @Prop({ default: () => RandomNumberGenerator.getUniqueId() })
  _id: string;

  @Prop({ required: true })
  first_name: string;

  @Prop({ default: '' })
  middle_name?: string;

  @Prop({ required: true })
  last_name: string;

  @Prop({ required: true, index: true, unique: true })
  mobile_number: string;

  @Prop({ default: false })
  mobile_number_verified: boolean;

  @Prop({ required: true, index: true, unique: true })
  email: string;

  @Prop({ default: false })
  email_verified: boolean;

  @Prop({ required: true, uppercase: true })
  gender: string;

  @Prop()
  birth_date: Date;

  @Prop()
  country: string;

  @Prop()
  state: string;

  @Prop()
  city: string;

  @Prop()
  pincode: string;

  @Prop()
  last_login: Date;

  // Automatically added by Mongoose with timestamps: true
  createdAt: Date;
  updatedAt: Date;
}

// Schema factory for creating Mongoose schema from the class
export const UserSchema = SchemaFactory.createForClass(User);

// Pre-save hook to set ID and timestamps
UserSchema.pre('save', function (next) {
  const now = new Date();
  const document = this as User;

  if (!document._id) {
    document._id = RandomNumberGenerator.getUniqueId();
  }
  document.updatedAt = now;

  if (!document.createdAt) {
    document.createdAt = now;
  }

  next();
});

export const CollectionName = 'User';
