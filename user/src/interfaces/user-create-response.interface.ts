import {IUser} from "./user.interface";

export interface IUserCreateResponse {
    status: number;
    message: string;
    data: IUser | null;
    errors: { [key: string]: any } | null;
}