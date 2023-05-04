import {IUser} from "./IUser";

export interface IGetUsersResponse {
    status: number;
    message: string;
    data: IUser[] | null;
    errors: { [key: string]: any};
}
