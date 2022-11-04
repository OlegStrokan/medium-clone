import {IUser} from "./IUser";

export interface IServiceUserUpdate {
    status: number;
    message: string;
    data: IUser | null;
}
