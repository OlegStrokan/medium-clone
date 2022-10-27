import {IPost} from "./post.interface";

export interface IPostCreateResponse {
    status: number;
    message: string;
    data: IPost | null;
    errors: { [key: string]: any } | null;
}
