import {IsNotEmpty, IsString} from "class-validator";

export class UpdateUserDto {
    @IsString({ message: 'Id must be a string' })
    @IsNotEmpty({ message: 'Id can\'t be empty'})
    id: string
    @IsString({ message: 'Full name must be a string' })
    @IsNotEmpty({ message: 'Full name can\'t be empty'})
    fullName: string;
    @IsString({ message: 'User name must be a string' })
    @IsNotEmpty({ message: 'User name can\'t be empty'})
    userName: string;
    @IsString({ message: 'Email must be a string' })
    @IsNotEmpty({ message: 'Email can\'t be empty'})
    email: string;
}
