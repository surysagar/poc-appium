import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { DeviceService } from '../services/device.service';
import { CreateDeviceDto } from '../dto/createDevice.dto';
import { UpdateDeviceDto } from '../dto/updateDevice.dto';
import { DeviceStatusEnum } from '../enums/deviceStatus.enum';

@ApiTags('Devices') // Grouping under 'Devices' in Swagger
@Controller({ path: 'device', version: '1' })
export class DevicesController {
  constructor(private readonly deviceService: DeviceService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({ summary: 'Create a new device' }) // Description of the endpoint
  @ApiBody({ type: CreateDeviceDto })
  @ApiResponse({ status: 201, description: 'Device created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  create(@Body() body: CreateDeviceDto) {
    return this.deviceService.create(body);
  }

  @Get('all')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({ summary: 'Get a list of all devices' })
  @ApiResponse({
    status: 200,
    description: 'List of devices returned successfully.',
  })
  @ApiQuery({
    name: 'status',
    enum: DeviceStatusEnum,
    description: 'Fetch only devices with the given status',
  })
  findAll(@Query('status') status: string) {
    return this.deviceService.findAll(status);
  }

  @Get(':device_id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({ summary: 'Get device by Device ID' })
  @ApiParam({
    name: 'device_id',
    description: 'Unique identifier of the device',
  }) // Describe the parameter
  @ApiResponse({
    status: 200,
    description: 'Device found and returned successfully.',
  })
  @ApiResponse({ status: 404, description: 'Device not found.' })
  findOne(@Param('device_id') device_id: string) {
    return this.deviceService.findOne(device_id);
  }

  @Put(':device_id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({ summary: 'Update a device by Device ID' })
  @ApiParam({
    name: 'device_id',
    description: 'Unique identifier of the device',
  })
  @ApiBody({ type: UpdateDeviceDto })
  @ApiResponse({ status: 200, description: 'Device updated successfully.' })
  @ApiResponse({ status: 404, description: 'Device not found.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  update(
    @Param('device_id') device_id: string,
    @Body() updateDeviceDto: UpdateDeviceDto,
  ) {
    return this.deviceService.update(device_id, updateDeviceDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({ summary: 'Delete a device by ID' })
  @ApiParam({ name: 'id', description: 'Unique identifier of the device' })
  @ApiResponse({ status: 200, description: 'Device deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Device not found.' })
  remove(@Param('id') id: string) {
    return this.deviceService.delete(id);
  }

  @Get('sync')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({ summary: 'Get AdbDevices' })
  @ApiResponse({
    status: 200,
    description: 'AdbDevices found and returned successfully.',
  })
  @ApiResponse({ status: 404, description: 'AdbDevice not found.' })
  async getAdbDevicesList() {
    const devices = await this.deviceService.syncDeviceList();
    return devices;
  }
}
