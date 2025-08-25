import { ApiProperty } from '@nestjs/swagger';
import { DeviceStatusEnum } from 'src/modules/devices/enums/deviceStatus.enum';
import { TestStatusEnum } from '../enums/testStatus.enum';
import { IsOptional } from 'class-validator';

export class FilterTestRunDto {
  @ApiProperty({
    description: 'Number of records to skip',
    example: 0,
    required: false,
  })
  @IsOptional()
  skip: number;

  @ApiProperty({
    description: 'Maximum number of records to return',
    example: 10,
    required: false,
  })
  @IsOptional()
  limit: number;

  @ApiProperty({
    description: 'ID of the device to filter by',
    example: 'device12345',
    required: false,
  })
  device_id: string;

  @ApiProperty({
    description: 'Status of the device to filter by',
    example: TestStatusEnum.SUCCESS,
    required: false,
    enum: DeviceStatusEnum,
  })
  status: DeviceStatusEnum;
}
