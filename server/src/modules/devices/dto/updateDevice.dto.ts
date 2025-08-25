import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum } from 'class-validator';
import { DeviceTypeEnum } from '../enums/deviceType.enum';
import { DeviceStatusEnum } from '../enums/deviceStatus.enum';
import { OperatingSystemEnum } from '../enums/operatingSystem.enum';

export class UpdateDeviceDto {
  @ApiPropertyOptional({
    description: 'Type of device',
    enum: DeviceTypeEnum,
    example: DeviceTypeEnum.MOBILE,
  })
  @IsEnum(DeviceTypeEnum)
  @IsOptional()
  device_type?: DeviceTypeEnum;

  @ApiPropertyOptional({
    description: 'Model of the device',
    example: 'Pixel 5',
  })
  @IsString()
  @IsOptional()
  device_model?: string;

  @ApiPropertyOptional({
    description: 'Operating system of the device',
    example: OperatingSystemEnum.ANDROID,
  })
  @IsEnum(OperatingSystemEnum)
  @IsOptional()
  os?: string;

  @ApiPropertyOptional({
    description: 'Operating system version of the device',
    example: '11.0',
  })
  @IsString()
  @IsOptional()
  os_version?: string;

  @ApiPropertyOptional({
    description: 'Unique port associated with the device',
    example: '4725',
  })
  @IsString()
  @IsOptional()
  port?: string;

  @ApiPropertyOptional({
    description: 'Status of the device',
    enum: DeviceStatusEnum,
    example: DeviceStatusEnum.ONLINE,
  })
  @IsEnum(DeviceStatusEnum)
  @IsOptional()
  status?: DeviceStatusEnum;
}
