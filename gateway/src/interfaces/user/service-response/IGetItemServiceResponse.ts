import {IUser} from "../IUser";

export interface IGetItemServiceResponse<T> {
    status: number;
    message: string;
    data: T | null;
    errors: { [key: string]: any};
}
