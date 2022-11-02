import {IUser} from "./IUser";

export interface IUserResponse {
    status: number;
    message: string;
    data: IUser | null;
}
