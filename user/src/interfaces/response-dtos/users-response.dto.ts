import {IUser} from "../IUser";

export class UsersResponseDto {
    message: string;
    status: number;
    data: IUser[] | null;
    errors?: { [key: string]: any }
}
