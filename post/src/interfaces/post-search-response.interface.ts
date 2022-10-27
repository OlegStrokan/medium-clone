import {IPost} from "./post.interface";

export interface IPostSearchResponse {
    status: number;
    message: string;
    data: IPost | null;
}
