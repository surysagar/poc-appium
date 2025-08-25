import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TestRun } from '../schemas/test-run.schema';
import { FilterTestRunDto } from '../dto/filterTestRuns.dto';
import { AppiumService } from 'src/modules/appium/services/appium.service';
import { RunTestDto } from 'src/modules/appium/dto/RunTest.dto';
import { PathResolver } from 'utils/PathResolver/pathResolver';
import { ReportTypeEnum } from 'src/modules/appium/enums/reportType.enum';
import { TestStatusEnum } from '../enums/testStatus.enum';
import { DeviceService } from 'src/modules/devices/services/device.service';
import { DeviceStatusEnum } from 'src/modules/devices/enums/deviceStatus.enum';
import { CreateTestRunDto } from '../dto/createTestRun.dto';
import { OperatingSystemEnum } from 'src/modules/devices/enums/operatingSystem.enum';
import { TestScriptsService } from 'src/modules/test-scripts/services/test-scripts.service';
import { DocumentService } from 'src/modules/document/services/document.service';
@Injectable()
export class TestRunService {
  private readonly logger = new Logger(TestRunService.name);
  private readonly pathResolver = PathResolver.Instance;

  constructor(
    @InjectModel('TestRun') private testRunModel: Model<TestRun>,
    @Inject(forwardRef(() => AppiumService))
    private appiumService: AppiumService,
    private deviceService: DeviceService,
    private testScriptService: TestScriptsService,
    private documentService: DocumentService,
  ) {}

  async create(
    testRunData: CreateTestRunDto,
    created_by: string,
  ): Promise<any> {
    let savedTestRun;
    let port: string = undefined;
    try {
      const device_info = await this.deviceService.findOne(
        testRunData.device_id,
      );

      if (!device_info) {
        return Promise.reject(new Error('Device not found'));
      }

      const script_info = await this.testScriptService.findOne(
        testRunData.script_id,
      );

      if (!script_info) {
        return Promise.reject(new Error('Test Suit is not found'));
      }

      const script = await this.documentService.findOne(script_info.script_id);

      if (!script) {
        return Promise.reject(new Error('Script not found'));
      }

      const ports = process.env.PORTS ? process.env.PORTS.split(',') : [];

      for (const p of ports) {
        const isPortAvailable = await this.deviceService.isPortAvailable(p);
        if (isPortAvailable) {
          port = p;
          break;
        }
      }

      if (!port) {
        return Promise.reject(new Error('No available port'));
      }

      let apkFile: string = undefined;
      if (testRunData.apk_id) {
        const apk = await this.documentService.findOne(testRunData.apk_id);
        if (!apk) {
          return Promise.reject(new Error('APK not found'));
        }
        apkFile = apk.name;
      }

      // Initialize a new TestRun instance and set initial fields
      const createdTestRun = new this.testRunModel(testRunData);
      createdTestRun.device_id = testRunData.device_id;
      createdTestRun.port = port.toString();
      createdTestRun.script_name = script.name;
      createdTestRun.created_by = created_by;
      createdTestRun.capabilities = testRunData.capabilities;

      // Save the TestRun document to the database before starting Appium
      savedTestRun = await createdTestRun.save();

      const body: RunTestDto = {
        platform: device_info.os as OperatingSystemEnum,
        deviceName: testRunData.device_id,
        port: parseInt(port),
        scriptType: script_info.test_type,
        scriptName: script.name,
        scriptId: testRunData.script_id,
        script: '',
        apkFile: apkFile,
        testId: savedTestRun._id,
        reportType: ReportTypeEnum.ALLURE,
        capabilities: testRunData.capabilities,
      };

      await this.deviceService.updatePortStatus(
        testRunData.device_id,
        port,
        DeviceStatusEnum.BUSY,
      );

      this.initiateTestRun(body, savedTestRun._id);

      return {
        message: 'Test started successfully',
        data: savedTestRun,
      };
    } catch (error) {
      this.logger.error(`Error executing test: ${error.message}`);
      await this.updateTestRunResult(
        savedTestRun._id,
        TestStatusEnum.FAILED,
        error,
      );
      return { message: 'Test execution failed.', error: error.message };
    }
  }

  async updateTestRunResult(id: string, status: TestStatusEnum, result: any) {
    try {
      const createdTestRun = await this.testRunModel.findById(id);
      createdTestRun.result = result;
      createdTestRun.status = status;
      await createdTestRun.save();
      await this.deviceService.updatePortStatus(
        createdTestRun.device_id,
        '',
        DeviceStatusEnum.ONLINE,
      );
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private async initiateTestRun(
    createTestRunDto: RunTestDto,
    testRunId: string,
  ) {
    try {
      const response =
        await this.appiumService.runTestOnDevice(createTestRunDto);
      if (response?.status) {
        await this.updateTestStatus(testRunId, TestStatusEnum.SUCCESS);
      }
      await this.deviceService.updatePortStatus(
        createTestRunDto.deviceName,
        '',
        DeviceStatusEnum.ONLINE,
      );
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async findAll(): Promise<TestRun[]> {
    try {
      const users = await this.testRunModel.find().exec();
      return Promise.resolve(users);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async findOne(id: string): Promise<TestRun> {
    try {
      return this.testRunModel.findById(id).exec();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async update(id: string, updateTestRunDto: any): Promise<TestRun> {
    try {
      return this.testRunModel.findByIdAndUpdate(id, updateTestRunDto, {
        new: true,
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async delete(id: string): Promise<any> {
    try {
      const deletedTestRun = await this.testRunModel
        .findByIdAndDelete(id)
        .exec();
      return deletedTestRun;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async findallTestRuns(filter: FilterTestRunDto) {
    try {
      const matchQuery = {} as { device_id: string; status: string };

      if (filter.device_id) {
        matchQuery.device_id = filter.device_id;
      }

      if (filter.status) {
        matchQuery.status = filter.status;
      }

      const aggregateQuery: any = [
        {
          $match: matchQuery,
        },
        {
          $sort: { createdAt: -1 },
        },
      ];

      if (filter.skip && filter.skip > 0) {
        aggregateQuery.push({
          $skip: filter.skip,
        });
      }

      if (filter.limit && filter.limit > 0) {
        aggregateQuery.push({
          $limit: filter.limit,
        });
      }

      aggregateQuery.push(
        {
          $lookup: {
            from: 'Device',
            localField: 'device_id',
            foreignField: 'device_id',
            as: 'device_details',
          },
        },
        {
          $unwind: {
            path: '$device_details',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'User',
            localField: 'created_by',
            foreignField: '_id',
            as: 'executed_by_details',
          },
        },
        {
          $unwind: {
            path: '$executed_by_details',
            preserveNullAndEmptyArrays: true,
          },
        },
      );

      const [result, totalCount] = await Promise.all([
        this.testRunModel.aggregate(aggregateQuery),
        this.testRunModel.countDocuments({}),
      ]);

      return Promise.resolve({ result, totalCount });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getTestResultPath(id: string) {
    try {
      const reportPath = this.pathResolver
        .resolvePath(`reports/${id}/index.html`)
        .replace(/\\/g, '/');
      return Promise.resolve(reportPath);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async updateTestStatus(id: string, status: TestStatusEnum): Promise<boolean> {
    try {
      const updatedTestRun = await this.testRunModel.findByIdAndUpdate(id, {
        status: status,
      });
      return Promise.resolve(updatedTestRun.status === status);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
