import {IUser} from "../IUser";

export class ResponseUserDto {
    status: number;
    message: string;
    data: IUser | null;
}
