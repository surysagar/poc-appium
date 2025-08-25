import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { TestScript } from '../schemas/test-script.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as fs from 'fs';
import * as path from 'path';
import { PathResolver } from 'utils/PathResolver/pathResolver';
import { DocumentService } from 'src/modules/document/services/document.service';
@Injectable()
export class TestScriptsService {
  private readonly logger = new Logger(TestScriptsService.name);
  private readonly pathResolver = PathResolver.Instance;

  constructor(
    @InjectModel('TestScript') private testScriptModel: Model<TestScript>,
    private documentService: DocumentService,
  ) {}

  // Create a new TestScript
  // async create(testScriptDto: any, created_by: string): Promise<TestScript> {
  //   const { name, description, test_type, script_id, step_file_ids } =
  //     testScriptDto;
  //   const newTestScript = new this.testScriptModel({
  //     name,
  //     description,
  //     test_type,
  //     script_id,
  //     added_by: created_by,
  //     step_file_ids: step_file_ids || [],
  //   });
  //   return await newTestScript.save();
  // }

  async create(testScriptDto: any, created_by: string): Promise<TestScript> {
    try {
      const { name, description, test_type, script_id, step_file_ids } =
        testScriptDto;

      // Create a new test script document
      const newTestScript = new this.testScriptModel({
        name,
        description,
        test_type,
        script_id,
        added_by: created_by,
        step_file_ids: step_file_ids || [],
      });

      // Save the document to get the generated _id
      const savedTestScript = await newTestScript.save();

      // Paths
      const baseDir = this.pathResolver.resolvePath(`scripts`);
      const newScriptFolder = path.join(
        baseDir,
        savedTestScript._id.toString(),
      );
      const featureFolder = path.join(newScriptFolder, 'features');
      const stepDefinitionsFolder = path.join(
        newScriptFolder,
        'step-definitions',
      );

      // Ensure folders exist
      fs.mkdirSync(featureFolder, { recursive: true });
      fs.mkdirSync(stepDefinitionsFolder, { recursive: true });

      // Move script_id to the feature folder
      const script = await this.documentService.findOne(script_id);
      if (!script) {
        throw new NotFoundException(`Script with ID ${script_id} not found`);
      }

      const scriptFilePath = path
        .join(baseDir, 'features', script.name)
        .replace(/\\/g, '/'); // Original location
      const newScriptFilePath = path
        .join(featureFolder, script.name)
        .replace(/\\/g, '/');
      if (fs.existsSync(scriptFilePath)) {
        fs.renameSync(scriptFilePath, newScriptFilePath);
      } else {
        console.warn(`Script file ${script_id} not found in ${scriptFilePath}`);
      }

      // Move step_file_ids to the stepdefinitions folder
      for (const stepFileId of step_file_ids || []) {
        const script = await this.documentService.findOne(stepFileId);
        if (!script) {
          throw new NotFoundException(
            `Definition Script with ID ${stepFileId} not found`,
          );
        }

        const stepFilePath = path
          .join(baseDir, 'step-definitions', script.name)
          .replace(/\\/g, '/'); // Original location
        const newStepFilePath = path
          .join(stepDefinitionsFolder, script.name)
          .replace(/\\/g, '/');

        if (fs.existsSync(stepFilePath)) {
          fs.renameSync(stepFilePath, newStepFilePath);
        } else {
          console.warn(`Step file ${stepFileId} not found in ${stepFilePath}`);
        }
      }

      return Promise.resolve(savedTestScript);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  // Retrieve all TestScripts
  async findAll(): Promise<TestScript[]> {
    return await this.testScriptModel
      .aggregate([
        {
          $lookup: {
            from: 'Document',
            localField: 'script_id',
            foreignField: '_id',
            as: 'script_details',
            pipeline: [
              {
                $project: { _id: 1, name: 1 },
              },
            ],
          },
        },
        {
          $lookup: {
            from: 'Document',
            localField: 'step_file_ids',
            foreignField: '_id',
            as: 'step_file_details',
            pipeline: [
              {
                $project: { _id: 1, name: 1 },
              },
            ],
          },
        },
        {
          $sort: { createdAt: -1 },
        },
      ])
      .exec();
  }

  // Retrieve a single TestScript by its ID
  async findOne(id: string): Promise<TestScript> {
    const testScript = await this.testScriptModel.findById(id).exec();
    if (!testScript) {
      throw new NotFoundException(`TestScript with ID ${id} not found`);
    }
    return testScript;
  }

  // Update a TestScript by its ID
  async update(
    id: string,
    updateDto: any,
    updated_by: string,
  ): Promise<TestScript> {
    const updatedTestScript = await this.testScriptModel
      .findByIdAndUpdate(
        id,
        {
          ...updateDto,
          $push: { added_by: updated_by }, // Optionally push to 'added_by' array if intended as a log
        },
        { new: true }, // Return the updated document
      )
      .exec();

    if (!updatedTestScript) {
      throw new NotFoundException(`TestScript with ID ${id} not found`);
    }

    return updatedTestScript;
  }

  // Delete a TestScript by its ID
  async delete(id: string): Promise<TestScript> {
    // Delete the document from the database
    const deletedTestScript = await this.testScriptModel
      .findByIdAndDelete(id)
      .exec();

    if (!deletedTestScript) {
      throw new NotFoundException(`TestScript with ID ${id} not found`);
    }

    // Resolve the folder path for the script
    const scriptDir = this.pathResolver.resolvePath(`scripts/${id}`);

    // Check if the directory exists
    if (fs.existsSync(scriptDir)) {
      // Delete the folder and all its contents recursively
      fs.rmSync(scriptDir, { recursive: true, force: true });
      console.log(`Deleted script directory: ${scriptDir}`);
    } else {
      console.warn(`Directory not found: ${scriptDir}`);
    }

    return deletedTestScript;
  }
}
