


import { ApiProperty } from '@nestjs/swagger';
import { HttpException, HttpStatus } from '@nestjs/common';
import {IError} from "../interfaces/IError";

export class GenericHttpException<T = IError> extends HttpException {
    @ApiProperty({example: '500'})
    statusCode: HttpStatus;

    @ApiProperty({example: 'Internal Server Error'})
    message: string;

    constructor(status: HttpStatus, message: string, ) {
        super(message, status);
        this.statusCode = status;
        this.message = message;
    }
}
