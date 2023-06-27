import {IsEmail, IsNotEmpty, IsString, Length} from "class-validator";
import {Transform} from "class-transformer";
import {ApiProperty} from "@nestjs/swagger";


export class CreateUserDto {
    @ApiProperty({ example: "Oleh Strokan"})
    @IsString({ message: 'Full name must be a string' })
    @IsNotEmpty({ message: 'Full name can\'t be empty'})
    fullName: string;
    @ApiProperty({ example: "stroka01"})
    @IsString({ message: 'User name must be a string' })
    @IsNotEmpty({ message: 'User name can\'t be empty'})
    userName: string;
    @ApiProperty({ example: "oleg14ua71@gmail.com"})
    @IsString({ message: 'Email name must be a string' })
    @IsNotEmpty({ message: 'Email name can\'t be empty'})
    @IsEmail()
    @Transform(({value}) => value.toLowerCase())
    email: string;
    @ApiProperty({ example: "8293827"})
    @IsString({ message: 'Password name must be a string' })
    @IsNotEmpty({ message: 'Password name can\'t be empty'})
    @Length(6,20, {message: "Password must be at least 6 characters long"})
    @Transform(({ value }) => value.trim())
    password: string;
}
