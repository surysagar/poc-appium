import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDate, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'First name of the user',
    example: 'John',
    required: false,
  })
  @IsString()
  @IsOptional()
  first_name: string;

  @ApiProperty({
    description: 'Middle name of the user (optional)',
    example: 'David',
    required: false,
  })
  @IsOptional()
  @IsString()
  middle_name?: string;

  @ApiProperty({
    description: 'Last name of the user',
    example: 'Doe',
    required: false,
  })
  @IsString()
  @IsOptional()
  last_name: string;

  @ApiProperty({
    description: 'Gender of the user',
    example: 'MALE',
    required: false,
  })
  @IsString()
  @IsOptional()
  gender: string;

  @ApiProperty({
    description: 'Birth date of the user',
    example: '1990-01-01T00:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDate()
  birth_date: Date;

  @ApiProperty({
    description: 'Country of the user',
    example: 'USA',
    required: false,
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({
    description: 'State of the user',
    example: 'California',
    required: false,
  })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({
    description: 'City of the user',
    example: 'Los Angeles',
    required: false,
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({
    description: 'Pincode of the user’s location',
    example: '90001',
    required: false,
  })
  @IsOptional()
  @IsString()
  pincode?: string;
}
