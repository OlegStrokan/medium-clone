import {Body, Controller, Get, HttpException, HttpStatus, Inject, Param, Post} from '@nestjs/common';
import {SERVICE} from "./interfaces/common/enum/microservices.enum";
import {ClientProxy} from "@nestjs/microservices";
import {IServicePostSearchResponse} from "./interfaces/post/service-post-search-response.interface";
import {firstValueFrom} from "rxjs";
import {MESSAGE_PATTERN} from "./interfaces/common/enum/message-patterns.enum";
import {IPost} from "./interfaces/post/post.interface";
import {IServicePostCreateResponse} from "./interfaces/post/service-post-create-response.interface";
import {CreatePostDto} from "./interfaces/post/dto/create-post.dto";
import {CreatePostResponseDto} from "./interfaces/post/dto/update-post.dto";
import {GetPostDto} from "./interfaces/post/dto/get-post.dto";

@Controller()
export class UsersController {
    constructor(@Inject(SERVICE.POST) private readonly postService: ClientProxy) {
    }

    @Get('/:id')
    public async getPostById(@Param('id') id: string): Promise<GetPostDto<IPost>> {
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
    public async getPostByUser(@Param('userId') userId: string): Promise<GetPostDto<IPost | IPost[]>> {
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


    @Post()
    public async createPost(@Body() dto: CreatePostDto): Promise<CreatePostResponseDto> {
        const postResponse: IServicePostCreateResponse = await firstValueFrom(
            this.postService.send(MESSAGE_PATTERN.CREATE_POST, dto)
        )

        if  (postResponse.status !== HttpStatus.CREATED) {
            throw new HttpException({
                message: postResponse.message,
                data: null,
                errors: postResponse.errors
            }, postResponse.status)
        }

        return {
            message: postResponse.message,
            data: {
                post: postResponse.data
            },
            errors: null,
        }
    }


}
