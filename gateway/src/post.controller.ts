import {Body, Controller, Delete, Get, HttpException, HttpStatus, Inject, Param, Patch, Post} from '@nestjs/common';
import {SERVICE} from "./interfaces/common/enum/microservices.enum";
import {ClientProxy} from "@nestjs/microservices";
import {IServicePostSearchResponse} from "./interfaces/post/service-post-search-response.interface";
import {firstValueFrom} from "rxjs";
import {MESSAGE_PATTERN} from "./interfaces/common/enum/message-patterns.enum";
import {IPost} from "./interfaces/post/post.interface";
import {IServicePostCreateResponse} from "./interfaces/post/service-post-create-response.interface";
import {CreatePost} from "./interfaces/post/dto/CreatePost";
import {GetPost} from "./interfaces/post/dto/GetPost";
import {UserUpdateDto} from "./interfaces/user/dto/UserUpdateDto";
import {CreatePostResponseDto} from "./interfaces/post/response-dto/CreatePostResponse.dto";
import {UpdatePostResponseDto} from "./interfaces/post/dto/UpdatePostResponse.dto";
import {IServicePostUpdateResponse} from "./interfaces/post/service-post-update-response.interface";
import {IServicePostDeleteResponse} from "./interfaces/post/service-post-delete-response.interface";
import {DeletePostResponse} from "./interfaces/post/dto/DeletePostResponse";

@Controller()
export class UsersController {
    constructor(@Inject(SERVICE.POST) private readonly postService: ClientProxy) {
    }

    @Get('/:id')
    public async getPostById(@Param('id') id: string): Promise<GetPost<IPost>> {
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
    public async getPostByUser(@Param('userId') userId: string): Promise<GetPost<IPost | IPost[]>> {
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
    public async createPost(@Body() dto: CreatePost): Promise<CreatePostResponseDto> {
        const postResponse: IServicePostCreateResponse = await firstValueFrom(
            this.postService.send(MESSAGE_PATTERN.CREATE_POST, dto)
        )

        if (postResponse.status !== HttpStatus.CREATED) {
            throw new HttpException({
                message: postResponse.message,
                data: null,
                errors: postResponse.errors
            }, postResponse.status)
        }

        return {
            message: postResponse.message,
            data: postResponse.data,
            errors: null,
        }
    }

    @Patch()
    public async updatePost(@Body() dto: UserUpdateDto): Promise<UpdatePostResponseDto> {
        const postResponse: IServicePostUpdateResponse = await firstValueFrom(
            this.postService.send(MESSAGE_PATTERN.UPDATE_POST, dto)
        )

        if (postResponse.status !== HttpStatus.OK) {
            throw new HttpException({
                message: postResponse.message,
                data: null,
                errors: postResponse.errors,
            }, postResponse.status)
        }

        return {
            message: postResponse.message,
            data: postResponse.data,
            errors: null
        }
    }

    @Delete()
    public async deletePost(id: string): Promise<DeletePostResponse> {
        const postResponse: IServicePostDeleteResponse = await firstValueFrom(
            this.postService.send(MESSAGE_PATTERN.DELETE_POST, id)
        )

        if (postResponse.status !== HttpStatus.ACCEPTED) {
            throw new HttpException({
                message: postResponse.message,
                data: postResponse.data,

            }, postResponse.status)
        }

        return {
            message: postResponse.message,
            data: postResponse.data,
            errors: null,
        }
    }


}
