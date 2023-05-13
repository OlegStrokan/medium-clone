import {IError} from "../IError";

export interface IGetItemServiceResponse<T> {
    status: number;
    message: string;
    data: T | null;
    errors: IError
}
