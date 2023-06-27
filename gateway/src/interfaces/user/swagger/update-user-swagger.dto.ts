import {HttpStatus} from "@nestjs/common";
import {ApiProperty} from "@nestjs/swagger";

export class UpdateUserSwaggerDto {
    @ApiProperty({ example: HttpStatus.OK })
    status: HttpStatus
    @ApiProperty({ example: " Your account has been successfully updated" })
    message: string;
}
