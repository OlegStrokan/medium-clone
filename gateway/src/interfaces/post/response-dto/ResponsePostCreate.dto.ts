import {IPost} from "../IPost";

export class ResponsePostCreateDto {
    message: string;
    data: IPost;
    errors: null;
}
