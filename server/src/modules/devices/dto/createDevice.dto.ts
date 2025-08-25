import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional } from 'class-validator';
import { DeviceTypeEnum } from '../enums/deviceType.enum';
import { DeviceStatusEnum } from '../enums/deviceStatus.enum';
import { OperatingSystemEnum } from '../enums/operatingSystem.enum';

export class CreateDeviceDto {
  @ApiProperty({
    description: 'Unique identifier for the device',
    example: 'device123',
  })
  @IsString()
  device_id: string;

  @ApiProperty({
    description: 'Type of device',
    enum: DeviceTypeEnum,
    example: DeviceTypeEnum.MOBILE,
    required: false,
  })
  @IsEnum(DeviceTypeEnum)
  @IsOptional()
  device_type: DeviceTypeEnum;

  @ApiProperty({
    description: 'Operating system of the device',
    example: OperatingSystemEnum.ANDROID,
  })
  @IsEnum(OperatingSystemEnum)
  os: string;

  @ApiProperty({
    description: 'Operating system version of the device',
    example: '11.0',
    required: false,
  })
  @IsString()
  @IsOptional()
  os_version?: string;

  @ApiProperty({
    description: 'Model of the device',
    example: 'Pixel 5',
    required: false,
  })
  @IsString()
  @IsOptional()
  device_model: string;
}
