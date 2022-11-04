import { Controller, Get } from '@nestjs/common';
import { PostService } from './services/post.service';
import {PostCreateDto} from "./interfaces/dto/PostCreateDto";
import {IPostCreateResponse} from "./interfaces/response-dto/ResponsePostCreateDto";
import {PostDeleteDto} from "./interfaces/dto/PostDeleteDto";
import {PostUpdateDto} from "./interfaces/dto/PostUpdateDto";
import {ResponsePostDto} from "./interfaces/response-dto/ResponsePostDto";
import {IPost} from "./interfaces/IPost";

@Controller()
export class PostController {
  constructor(private readonly postService: PostService) {}

  public async getPost(id: string): Promise<ResponsePostDto<IPost>> {
    return this.postService.getPost(id);
  }

  public async getPostsByUser(userId: string): Promise<ResponsePostDto<IPost[]>> {
    return this.postService.getPostsByUser(userId);
  }

  public async createPost(dto: PostCreateDto): Promise<IPostCreateResponse> {
    return this.postService.create(dto);
  }

  public async updatePost(dto: PostUpdateDto): Promise<ResponsePostDto<IPost>> {
    return this.postService.update(dto);
  }

  public async deletePost(dto: PostDeleteDto): Promise<ResponsePostDto<IPost>> {
    return this.postService.delete(dto);
  }


}
