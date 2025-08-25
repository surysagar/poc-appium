import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Device } from 'src/modules/devices/schemas/device.schema';
import { TestScript } from 'src/modules/test-scripts/schemas/test-script.schema';
import { TestRun } from 'src/modules/test-runs/schemas/test-run.schema';
import { DeviceStatusEnum } from 'src/modules/devices/enums/deviceStatus.enum';
import { TestStatusEnum } from 'src/modules/test-runs/enums/testStatus.enum';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel('Device') private deviceModel: Model<Device>,
    @InjectModel('TestScript') private testScriptModel: Model<TestScript>,
    @InjectModel('TestRun') private testRunModel: Model<TestRun>,
  ) {}

  async getDashboardSummary() {
    try {
      // Aggregate devices by OS for online devices
      const deviceCounts = await this.deviceModel.aggregate([
        {
          $group: {
            _id: '$os', // Group by the 'os' field
            count: { $sum: 1 }, // Count the occurrences
          },
        },
      ]);

      // Convert the aggregation result into a structured object
      const deviceList = deviceCounts.reduce((acc, curr) => {
        acc[curr._id] = curr.count; // Map OS names to their counts
        return acc;
      }, {});

      // Get the total count of devices (regardless of status)
      const totalDeviceCount = await this.deviceModel.countDocuments().exec();

      // Get count of available test scripts
      const testScriptCount = await this.testScriptModel
        .countDocuments()
        .exec();

      // Aggregate test run counts for SUCCESS and FAILURE
      const testRunCounts = await this.testRunModel.aggregate([
        {
          $match: {
            status: { $in: [TestStatusEnum.SUCCESS, TestStatusEnum.FAILED] },
          },
        },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ]);

      // Process test run results into a structured format
      const testRunResults = testRunCounts.reduce(
        (acc, curr) => {
          acc[curr._id === TestStatusEnum.SUCCESS ? 'success' : 'failure'] =
            curr.count;
          return acc;
        },
        { success: 0, failure: 0 }, // Default values
      );

      // Return the updated dashboard summary
      return {
        deviceList, // OS-based counts
        totalDevices: totalDeviceCount, // Total device count
        testScript: testScriptCount,
        testRunSuccess: testRunResults.success,
        testRunFailure: testRunResults.failure,
      };
    } catch (error) {
      throw new Error(`Failed to fetch dashboard data: ${error.message}`);
    }
  }

  async getWeeklyTestRunSummary() {
    try {
      // Get the current date
      const now = new Date();

      // Calculate the start of the 7-day period (7 days ago)
      const sevenDaysAgo = new Date(now);
      sevenDaysAgo.setDate(now.getDate() - 7); // Go back 7 days

      // Query test run data from the last 7 days
      const testRunData = await this.testRunModel.aggregate([
        {
          $match: {
            createdAt: {
              $gte: sevenDaysAgo, // Data from the last 7 days
              $lte: now, // Until the current date
            },
          },
        },
        {
          $sort: {
            createdAt: 1, // Sort by createdAt in ascending order
          },
        },
        {
          $group: {
            _id: {
              day: { $dayOfWeek: '$createdAt' },
              date: {
                $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
              },
            },
            running: {
              $sum: {
                $cond: [{ $eq: ['$status', TestStatusEnum.INPROGRESS] }, 1, 0],
              },
            },
            passed: {
              $sum: {
                $cond: [{ $eq: ['$status', TestStatusEnum.SUCCESS] }, 1, 0],
              },
            },
            failed: {
              $sum: {
                $cond: [{ $eq: ['$status', TestStatusEnum.FAILED] }, 1, 0],
              },
            },
          },
        },
      ]);

      // Map MongoDB aggregation results into a readable format
      const daysOfWeek = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ];

      const formattedResults = testRunData.map((entry) => {
        const dayIndex = (entry._id.day - 1) % 7; // Adjust MongoDB's dayOfWeek (1 = Sunday, 7 = Saturday)
        return {
          day: daysOfWeek[dayIndex],
          date: entry._id.date, // Formatted date
          running: entry.running,
          passed: entry.passed,
          failed: entry.failed,
        };
      });

      // Sort by date
      formattedResults.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      );

      return formattedResults;
    } catch (error) {
      throw new Error(
        `Failed to fetch weekly test run summary: ${error.message}`,
      );
    }
  }
}
