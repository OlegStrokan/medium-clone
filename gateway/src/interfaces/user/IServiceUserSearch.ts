import {IUser} from "./IUser";

export interface IServiceUserSearch {
    status: number;
    message: string;
    data: IUser | null;
}
