import {IUser} from "../../IUser";

export class ResponseUserGetByIdDto {
    message: string;
    data: {
        user: IUser;
    }
    errors: { [key: string]: any };
}
