import {IPost} from "./post.interface";

export interface IServicePostUpdateResponse {
    message: string;
    status; string;
    data: IPost| null;
    errors: { [key: string]: any }
}
