import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { exec } from 'child_process';
import { promisify } from 'util';
import { Device } from '../schemas/device.schema';
import { CreateDeviceDto } from '../dto/createDevice.dto';
import { DeviceStatusEnum } from '../enums/deviceStatus.enum';
import { OperatingSystemEnum } from '../enums/operatingSystem.enum';
import { DeviceInfo } from '../interfaces/deviceInfo.interface';

const execPromise = promisify(exec);

@Injectable()
export class DeviceService {
  constructor(@InjectModel('Device') private deviceModel: Model<Device>) {}

  async create(createDeviceDto: CreateDeviceDto): Promise<Device> {
    try {
      const createdDevice = new this.deviceModel(createDeviceDto);
      const savedDevice = await createdDevice.save();
      return Promise.resolve(savedDevice);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async findAll(status: string = 'all'): Promise<Device[]> {
    try {
      let findQuery = {};

      if (status === DeviceStatusEnum.ONLINE) {
        findQuery = {
          status: DeviceStatusEnum.ONLINE,
        };
      }
      const users = await this.deviceModel
        .find(findQuery)
        .sort({ createdAt: -1 })
        .exec();
      return Promise.resolve(users);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async findOne(id: string): Promise<Device> {
    try {
      return this.deviceModel.findOne({ device_id: id }).exec();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async update(id: string, updateDeviceDto: any): Promise<Device> {
    try {
      const updatedDevice = await this.deviceModel.findOneAndUpdate(
        { device_id: id },
        updateDeviceDto,
        {
          new: true,
        },
      );
      return updatedDevice;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async delete(id: string): Promise<any> {
    try {
      const deletedDevice = await this.deviceModel.findByIdAndDelete(id).exec();
      return deletedDevice;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getAdbDevicesList(): Promise<DeviceInfo[]> {
    try {
      // Get list of connected ADB devices
      const { stdout } = await execPromise('adb devices');
      const devices = stdout
        .split('\n')
        .slice(1)
        .map((line) => line.trim())
        .filter((line) => line && line.includes('\tdevice'))
        .map((line) => line.split('\t')[0]); // Get only the device ID

      // Create device objects
      const deviceList = devices.map((device_id) => ({
        device_id,
        os: OperatingSystemEnum.ANDROID,
        status: DeviceStatusEnum.ONLINE,
      }));

      return deviceList;
    } catch (error) {
      console.error('Error fetching ADB devices:', error);
      return [];
    }
  }

  async syncDeviceList(): Promise<boolean> {
    try {
      const androidDevices = await this.getAdbDevicesList();
      const iosDevices = await this.getIphoneDevicesList();

      const deviceList = [...androidDevices, ...iosDevices];

      // Retrieve all devices from DB once
      const allDevices = await this.deviceModel.find().exec();

      // Prepare sets for efficient lookup
      const connectedDeviceIds = new Set(
        deviceList.map((device) => device.device_id),
      );
      const dbDeviceMap = new Map(
        allDevices.map((device) => [device.device_id, device]),
      );

      const bulkOps = [];

      // Handle new devices (not in DB)
      for (const device of deviceList) {
        if (!dbDeviceMap.has(device.device_id)) {
          bulkOps.push({
            insertOne: {
              document: {
                device_id: device.device_id, // Ensure device_id is a string here
                os: device.os,
                status: DeviceStatusEnum.ONLINE,
              },
            },
          });
        }
      }

      // Update devices' status to online if they are connected and currently offline in DB
      for (const [device_id, dbDevice] of dbDeviceMap) {
        if (
          connectedDeviceIds.has(device_id) &&
          dbDevice.status === DeviceStatusEnum.OFFLINE
        ) {
          bulkOps.push({
            updateOne: {
              filter: { device_id: dbDevice.device_id },
              update: { $set: { status: DeviceStatusEnum.ONLINE } },
            },
          });
        }
      }

      // Set status to offline for devices in DB that are not in the connected device list
      for (const [device_id, dbDevice] of dbDeviceMap) {
        if (
          !connectedDeviceIds.has(device_id) &&
          dbDevice.status !== DeviceStatusEnum.OFFLINE
        ) {
          bulkOps.push({
            updateOne: {
              filter: { device_id: dbDevice.device_id },
              update: { $set: { status: DeviceStatusEnum.OFFLINE } },
            },
          });
        }
      }

      // Execute all operations in a single bulk write
      if (bulkOps.length > 0) {
        await this.deviceModel.bulkWrite(bulkOps);
      }

      return Promise.resolve(true);
    } catch (error) {
      console.error('Error syncing device list:', error);
      return Promise.reject(error);
    }
  }

  async updatePortStatus(
    device_id: string,
    port: string,
    status: DeviceStatusEnum,
  ) {
    try {
      const device = await this.deviceModel.findOne({ device_id }).exec();
      if (!device) {
        throw new Error('Device not found');
      }

      //update the port and status to the device
      device.port = port;
      device.status = status;
      await device.save();

      return Promise.resolve(device);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getIphoneDevicesList(): Promise<DeviceInfo[]> {
    try {
      // Get physical devices
      const physicalDevicesOutput = await execPromise('idevice_id -l');
      const physicalDevices = physicalDevicesOutput.stdout
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean) // Remove empty lines
        .map((device_id) => ({
          device_id,
          os: OperatingSystemEnum.IOS,
          status: DeviceStatusEnum.ONLINE,
          type: 'Physical',
        }));

      // Get simulators
      const simulatorsOutput = await execPromise('xcrun simctl list devices');
      const bootedSimulators = simulatorsOutput.stdout
        .split('\n')
        .map((line) => line.trim())
        .filter(
          (line) =>
            line.includes('Booted') && // Only include booted simulators
            line.includes('(') &&
            line.includes(')') &&
            !line.includes('=='),
        );
      const result = bootedSimulators.map((line) => {
        const match = line.match(/^(.*?) \((.*?)\) \((.*?)\)$/);
        if (!match) {
          console.warn('Could not parse simulator line:', line);
          return null;
        }
        const [_, name, udid] = match;
        return {
          device_id: udid.trim(),
          name: name.trim(),
          os: OperatingSystemEnum.IOS,
          status: DeviceStatusEnum.ONLINE,
        };
      });

      // Combine physical devices and booted simulators
      const allDevices = [...physicalDevices, ...result];

      return allDevices;
    } catch (error) {
      console.error('Error fetching iPhone devices:', error);
      return [];
    }
  }

  async isPortAvailable(port: string): Promise<boolean> {
    try {
      const device = await this.deviceModel.findOne({ port }).exec();
      return !device;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
