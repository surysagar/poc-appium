import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserCredential } from '../schemas/userCredential.schema';

@Injectable()
export class UserCredentialService {
  constructor(
    @InjectModel('UserCredential')
    private userCredentialModel: Model<UserCredential>,
  ) {}

  async create(createuserCredentialDto: any): Promise<UserCredential> {
    try {
      const createduserCredential = new this.userCredentialModel(
        createuserCredentialDto,
      );
      const savedCredentials = await createduserCredential.save();
      return Promise.resolve(savedCredentials);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async findOne(id: string): Promise<UserCredential> {
    try {
      return this.userCredentialModel.findById(id).exec();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async update(
    id: string,
    updateuserCredentialDto: any,
  ): Promise<UserCredential> {
    try {
      const updatedCredentials =
        await this.userCredentialModel.findByIdAndUpdate(
          id,
          updateuserCredentialDto,
          { new: true },
        );
      return Promise.resolve(updatedCredentials);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async delete(id: string): Promise<any> {
    try {
      return this.userCredentialModel.findOneAndDelete({ user_id: id }).exec();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async validateCredentials(userName: string) {
    try {
      const credentials = await this.userCredentialModel.findOne({
        user_name: userName,
      });

      if (credentials) {
        return Promise.resolve(credentials.user_id);
      } else {
        throw new UnauthorizedException();
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
