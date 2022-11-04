import {IUser} from "../IUser";

export class ResponseUserGetByIdDto {
    message: string;
    data: IUser | null;
    errors: { [key: string]: any };
}
