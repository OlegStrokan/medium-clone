import {IPost} from "../post.interface";

export class UpdatePostResponseDto {
    message: string;
    data: IPost;
    errors: { [key: string]: any };
}
