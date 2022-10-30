import {IUser} from "./user.interface";

export interface IServiceUserCreateResponse {
    status: number;
    message: string;
    data: IUser | null;
    errors: {[key: string]: any}
}
