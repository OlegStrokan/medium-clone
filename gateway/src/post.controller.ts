import {Controller, Get, Inject, Param} from '@nestjs/common';
import {SERVICE} from "./interfaces/common/enum/microservices.enum";
import {ClientProxy} from "@nestjs/microservices";
import {GetPostByIdResponseDto} from "./interfaces/post/dto/GetPostByIdResponse.dto";
import {IServicePostSearchResponse} from "./interfaces/post/service-post-search-response.interface";
import {firstValueFrom} from "rxjs";
import {MESSAGE_PATTERN} from "./interfaces/common/enum/message-patterns.enum";
import {IPost} from "./interfaces/post/post.interface";


@Controller()
export class UsersController {
  constructor(@Inject(SERVICE.POST) private readonly postService: ClientProxy) {}

  @Get('/:id')
  public async getPostById(@Param('id') id: string): Promise<GetPostByIdResponseDto> {
    const postResponse: IServicePostSearchResponse<IPost> = await firstValueFrom(
        this.postService.send(MESSAGE_PATTERN.GET_POST_BY_ID, id)
    )

    return {
      message: postResponse.message,
      data: {
        post: postResponse.data,
      },
      errors: null
    }
  }

  @Get('/:userId')
  public async getPostByUser(@Param('userId') userId: string) {
    const postResponse: IServicePostSearchResponse<IPost[] | IPost> = await firstValueFrom(
        this.postService.send(MESSAGE_PATTERN.GET_POSTS_BY_USER, userId)
    )

    return {
      message: postResponse.message,
      data: {
        post: postResponse.data,
      },
      errors: null
    }
  }

}
