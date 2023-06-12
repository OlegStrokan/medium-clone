import {HttpStatus} from "@nestjs/common";


export class ResponseRoleDto<T> {
    status: HttpStatus;
    message: string;
    data: T | null;
    errors?: any
}
