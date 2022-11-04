import {IPost} from "../post.interface";

export class CreatePostResponseDto {
    message: string;
    data: IPost;
    errors: null;
}
