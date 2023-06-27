import {HttpStatus} from "@nestjs/common";
import {ApiProperty} from "@nestjs/swagger";

export class DeleteUserSwaggerDto {
    @ApiProperty({ example: HttpStatus.NO_CONTENT })
    status: HttpStatus
    @ApiProperty({ example: " Your account has been successfully deleted" })
    message: string;
}
