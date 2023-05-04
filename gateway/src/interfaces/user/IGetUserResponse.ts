import {IUser} from "./IUser";

export interface IGetUserResponse {
    status: number;
    message: string;
    data: IUser | null;
    errors: { [key: string]: any};
}
