import {HttpException, HttpStatus} from "@nestjs/common";

export class GenericHttpException<T> extends HttpException {
    constructor(status: HttpStatus, message: string, public readonly data?: T) {
        super(message, status);
    }
}
