import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Documents } from '../schemas/document.schema';

@Injectable()
export class DocumentService {
  constructor(@InjectModel('Document') private deviceModel: Model<Documents>) {}

  async create(createDocumentsDto: any): Promise<Documents> {
    try {
      const createdDocuments = new this.deviceModel(createDocumentsDto);
      const savedDocuments = await createdDocuments.save();
      return Promise.resolve(savedDocuments);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async findAll(): Promise<Documents[]> {
    try {
      const users = await this.deviceModel.find().exec();
      return Promise.resolve(users);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async findOne(id: string): Promise<Documents> {
    try {
      return this.deviceModel.findOne({ _id: id }).exec();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async update(id: string, updateDocumentsDto: any): Promise<Documents> {
    try {
      const updatedDocuments = await this.deviceModel.findOneAndUpdate(
        { device_id: id },
        updateDocumentsDto,
        {
          new: true,
        },
      );
      return updatedDocuments;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async delete(id: string): Promise<any> {
    try {
      const deletedDocuments = await this.deviceModel
        .findByIdAndDelete(id)
        .exec();
      return deletedDocuments;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
