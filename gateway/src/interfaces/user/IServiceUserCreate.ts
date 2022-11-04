import {IUser} from "./IUser";

export interface IServiceUserCreate {
    status: number;
    message: string;
    data: IUser | null;
    errors: {[key: string]: any}
}
