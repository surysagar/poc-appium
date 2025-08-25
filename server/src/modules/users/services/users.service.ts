import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { UserCredentialService } from './userCredential.service';
import { UserCredential } from '../schemas/userCredential.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    private userCredentialService: UserCredentialService,
  ) {}

  async create(createUserDto: any): Promise<User> {
    try {
      const createdUser = new this.userModel(createUserDto);
      const savedUser = await createdUser.save();
      const userCrentials = {
        user_id: savedUser._id,
        user_name: createUserDto.credentials.user_name,
        password: createUserDto.credentials.password,
      } as UserCredential;
      const savedUserCredential =
        await this.userCredentialService.create(userCrentials);
      return Promise.resolve(savedUser);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async findAll(): Promise<User[]> {
    try {
      const users = await this.userModel.find().exec();
      return Promise.resolve(users);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async findOne(id: string): Promise<User> {
    try {
      return this.userModel.findById(id).exec();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async update(id: string, updateUserDto: any): Promise<User> {
    try {
      return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async delete(id: string): Promise<any> {
    try {
      const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
      this.userCredentialService.delete(id);
      return deletedUser;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
