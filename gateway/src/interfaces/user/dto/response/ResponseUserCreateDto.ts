import {IUser} from "../../IUser";

export class CreateUserResponseDto {
    message: string;
    data: {
        user: IUser,
        token: string;
    }
    errors: { [key: string]: any }
}

