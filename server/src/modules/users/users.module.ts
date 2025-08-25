import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CollectionName as UserCollectionName,
  UserSchema,
} from './schemas/user.schema';
import { UsersService } from './services/users.service';
import {
  CollectionName as UserCredentialCollectionName,
  UserCredentialSchema,
} from './schemas/userCredential.schema';
import { UserCredentialService } from './services/userCredential.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserCollectionName, schema: UserSchema },
      { name: UserCredentialCollectionName, schema: UserCredentialSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UserCredentialService],
  exports: [UsersService, UserCredentialService],
})
export class UsersModule {}
