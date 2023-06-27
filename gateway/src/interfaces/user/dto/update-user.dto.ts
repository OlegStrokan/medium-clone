import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateUserDto {
   @ApiProperty({ example: 'John Doe' })
   @IsString({ message: 'Full name must be a string' })
   @IsNotEmpty({ message: 'Full name can\'t be empty' })
   fullName: string;

   @ApiProperty({ example: 'johndoe' })
   @IsString({ message: 'User name must be a string' })
   @IsNotEmpty({ message: 'User name can\'t be empty' })
   userName: string;

   @ApiProperty({ example: 'johndoe@example.com' })
   @IsString({ message: 'Email name must be a string' })
   @IsNotEmpty({ message: 'Email name can\'t be empty' })
   @IsEmail()
   @Transform(({ value }) => value.toLowerCase())
   email: string;
}
