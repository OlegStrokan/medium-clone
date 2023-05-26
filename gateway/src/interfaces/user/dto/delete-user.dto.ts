import {IsNotEmpty, IsString } from "class-validator";

export class DeleteUserDto {
   @IsString({ message: 'ID must be a string' })
   @IsNotEmpty({ message: 'ID can\'t be empty'})
   id: string;

}
