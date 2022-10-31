import {IPost} from "./post.interface";

export interface IServicePostCreateResponse {
    message: string;
    status; string;
    data: IPost| null;
    errors: { [key: string]: any }
}
