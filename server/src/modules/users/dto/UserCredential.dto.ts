import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UserCredentialDto {

    @ApiProperty({
        description: 'The username for user login',
        example: 'johndoe',
        required: true
    })
    @IsString()
    user_name: string;

    @ApiProperty({
        description: 'The password for user login',
        example: 'P@ssw0rd!',
        required: true
    })
    @IsString()
    password: string;

}
