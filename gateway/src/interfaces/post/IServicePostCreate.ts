import {IPost} from "./IPost";

export interface IServicePostCreate {
    message: string;
    status; string;
    data: IPost| null;
    errors: { [key: string]: any }
}
