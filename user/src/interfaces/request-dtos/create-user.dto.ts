import {IsNotEmpty, IsString, Length} from "class-validator";

export class CreateUserDto {
    @IsString({ message: 'Full name must be a string' })
    @IsNotEmpty({ message: 'Full name can\'t be empty'})
    fullName: string;
    @IsString({ message: 'User name must be a string' })
    @IsNotEmpty({ message: 'User name can\'t be empty'})
    userName: string;
    @IsString({ message: 'Email name must be a string' })
    @IsNotEmpty({ message: 'Email name can\'t be empty'})
    email: string;
    @IsString({ message: 'Password name must be a string' })
    @IsNotEmpty({ message: 'Password name can\'t be empty'})
    @Length(1,4)
    password: string;
}
