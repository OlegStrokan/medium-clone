import {IUser} from "../IUser";

export class UserResponseDto {
    message: string;
    status: number;
    data: IUser | null;
    errors?: { [key: string]: any }
}
