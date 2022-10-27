import { Controller, Get } from '@nestjs/common';
import { PostService } from './services/post.service';
import {IPostCreate} from "./interfaces/post-create.interface";
import {IPostCreateResponse} from "./interfaces/post-create-response.interface";
import {IPostDelete} from "./interfaces/post-delete.interface";
import {IPostUpdate} from "./interfaces/post-update.interface";
import {IPostResponse} from "./interfaces/post-response.interface";
import {IPost} from "./interfaces/post.interface";

@Controller()
export class PostController {
  constructor(private readonly postService: PostService) {}

  public async getPost(id: string): Promise<IPostResponse<IPost>> {
    return this.postService.getPost(id);
  }

  public async getPostsByUser(userId: string): Promise<IPostResponse<IPost[]>> {
    return this.postService.getPostsByUser(userId);
  }

  public async createPost(dto: IPostCreate): Promise<IPostCreateResponse> {
    return this.postService.create(dto);
  }

  public async updatePost(dto: IPostUpdate): Promise<IPostResponse<IPost>> {
    return this.postService.update(dto);
  }

  public async deletePost(dto: IPostDelete): Promise<IPostResponse<IPost>> {
    return this.postService.delete(dto);
  }


}
