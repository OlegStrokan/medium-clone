import {ResponseUserDto} from "./ResponseUserDto";

export class ResponseUserCreateDto extends ResponseUserDto {
    errors: { [key: string]: any }
}
