import {IPost} from "../post.interface";

export class GetPostByIdResponseDto {
    message: string;
    data: {
        post: IPost
    };
    errors: { [key: string]: any };
}
