import {IsEmail, IsNotEmpty, IsString } from "class-validator";
import {Transform} from "class-transformer";

export class UpdateUserDto {
   @IsString({ message: 'Full name must be a string' })
   @IsNotEmpty({ message: 'Full name can\'t be empty'})
   fullName: string;
   @IsString({ message: 'User name must be a string' })
   @IsNotEmpty({ message: 'User name can\'t be empty'})
   userName: string;
   @IsString({ message: 'Email name must be a string' })
   @IsNotEmpty({ message: 'Email name can\'t be empty'})
   @IsEmail()
   @Transform(({value}) => value.toLowerCase())
   email: string;
}
