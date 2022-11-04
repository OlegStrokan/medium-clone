import {IUser} from "../IUser";

export class ResponseUserUpdateDto {
    message: string;
    data: IUser | null;
    errors: { [key: string]: any }
}
