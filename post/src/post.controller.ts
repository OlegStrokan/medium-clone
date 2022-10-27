import { Controller, Get } from '@nestjs/common';
import { PostService } from './services/post.service';

@Controller()
export class PostController {
  constructor(private readonly postService: PostService) {}

  public async createPost(dto: IUserCreate) {
    return this.postService.create(dto);
  }
}
