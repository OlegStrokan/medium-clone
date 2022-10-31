import {IPost} from "../post.interface";

export class CreatePostResponseDto{
   message: string;
   data: {
      post: IPost;
   }
   errors: { [key: string]: any}
}
