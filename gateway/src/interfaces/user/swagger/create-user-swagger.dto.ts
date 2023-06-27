import {HttpStatus} from "@nestjs/common";
import {ApiProperty} from "@nestjs/swagger";

export class CreateUserSwaggerDto {
    @ApiProperty({ example: HttpStatus.CREATED })
    status: HttpStatus
    @ApiProperty({ example: " Your account has been successfully created" })
    message: string;
}
