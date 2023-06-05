import {IsEmail, IsNotEmpty, IsString, Length} from "class-validator";
import {Transform} from "class-transformer";

export class LogoutDto {
    @IsString({ message: 'Id must be a string' })
    @IsNotEmpty({ message: 'Id can\'t be empty'})
    @Transform(({value}) => value.toLowerCase())
    id: string;
}
