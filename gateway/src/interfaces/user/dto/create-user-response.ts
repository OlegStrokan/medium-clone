import {IUser} from "../user.interface";

export class CreateUserResponseDto {
    message: string;
    data: {
        user: IUser,
        token: string;
    }
    errors: { [key: string]: any }
}
