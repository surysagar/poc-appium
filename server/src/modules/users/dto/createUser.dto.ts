import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsEmail, IsDate, IsOptional, ValidateNested } from 'class-validator';
import { UserCredentialDto } from './userCredential.dto';

export class CreateUserDto {

    @ApiProperty({
        description: 'First name of the user',
        example: 'John',
    })
    @IsString()
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
    })
    @IsString()
    last_name: string;

    @ApiProperty({
        description: 'Mobile number of the user',
        example: '+1234567890',
    })
    @IsString()
    mobile_number: string;

    @ApiProperty({
        description: 'Email address of the user',
        example: 'john.doe@example.com',
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'Gender of the user',
        example: 'MALE',
    })
    @IsString()
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

    @ApiProperty({
        description: 'Credentials for the user',
        type: UserCredentialDto,  // Reference the credential DTO
    })
    @ValidateNested()
    @Type(() => UserCredentialDto)
    credentials: UserCredentialDto;
}
