import {HttpStatus} from "@nestjs/common";
import {IError} from "../IError";

export class ResponseTokenDto<T> {
    status: HttpStatus;
    message: string;
    data: T | null;
    errors?: any
}
