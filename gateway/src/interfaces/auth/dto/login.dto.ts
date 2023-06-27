import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class LoginDto {
    @ApiProperty({ example: 'john@example.com', description: 'User email' })
    @IsString({ message: 'Email name must be a string' })
    @IsNotEmpty({ message: 'Email name can\'t be empty' })
    @IsEmail()
    @Transform(({ value }) => value.toLowerCase())
    email: string;

    @ApiProperty({ example: 'password123', description: 'User password' })
    @IsString({ message: 'Password name must be a string' })
    @IsNotEmpty({ message: 'Password name can\'t be empty' })
    @Length(6, 20, { message: 'Password must be at least 6 characters long' })
    @Transform(({ value }) => value.trim())
    password: string;
}
