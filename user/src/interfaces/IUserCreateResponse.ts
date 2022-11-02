import {IUserResponse} from "./IUserResponse";

export interface IUserCreateResponse extends IUserResponse {
    errors: { [key: string]: any }
}
