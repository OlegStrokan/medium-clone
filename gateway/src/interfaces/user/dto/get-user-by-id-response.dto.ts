import {IUser} from "../user.interface";

export class GetUserByIdResponseDto {
    message: string;
    data: {
        user: IUser;
    }
    errors: {[key: string]: any}
}
