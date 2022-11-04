import {IPost} from "../IPost";

export class ResponsePostUpdate {
    message: string;
    data: IPost;
    errors: { [key: string]: any };
}
