import {HttpException, HttpStatus} from "@nestjs/common";
import {IError} from "../interfaces/user/IError";

export class GenericHttpException<T = IError> extends HttpException {
    constructor(status: HttpStatus, message: string, public readonly data?: T) {
        super(message, status);
    }
}
