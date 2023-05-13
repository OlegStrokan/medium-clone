import {IError} from "../IError";

export interface IGetItemResponse<T> {
    data: T | null,
    errors: IError
}
