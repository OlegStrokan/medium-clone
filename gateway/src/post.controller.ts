import {Body, Controller, Delete, Get, HttpException, HttpStatus, Inject, Param, Patch, Post} from '@nestjs/common';
import {SERVICE} from "./interfaces/common/enum/microservices.enum";
import {ClientProxy} from "@nestjs/microservices";
import {IServicePostSearch} from "./interfaces/post/IServicePostSearch";
import {firstValueFrom} from "rxjs";
import {MESSAGE_PATTERN} from "./interfaces/common/enum/message-patterns.enum";
import {IPost} from "./interfaces/post/IPost";
import {IServicePostCreate} from "./interfaces/post/IServicePostCreate";
import {PostCreateDto} from "./interfaces/post/dto/PostCreateDto";
import {ResponsePostGetDto} from "./interfaces/post/response-dto/ResponsePostGetDto";
import {UserUpdateDto} from "./interfaces/user/dto/UserUpdateDto";
import {ResponsePostCreateDto} from "./interfaces/post/response-dto/ResponsePostCreate.dto";
import {ResponsePostUpdate} from "./interfaces/post/response-dto/ResponsePostUpdate";
import {IServicePostUpdate} from "./interfaces/post/IServicePostUpdate";
import {IServicePostDelete} from "./interfaces/post/IServicePostDelete";
import {ResponsePostDelete} from "./interfaces/post/response-dto/ResponsePostDelete";

@Controller()
export class UsersController {
    constructor(@Inject(SERVICE.POST) private readonly postService: ClientProxy) {
    }

    @Get('/:id')
    public async getPostById(@Param('id') id: string): Promise<ResponsePostGetDto<IPost>> {
        const postResponse: IServicePostSearch<IPost> = await firstValueFrom(
            this.postService.send(MESSAGE_PATTERN.GET_POST_BY_ID, id)
        )

        return {
            message: postResponse.message,
            data: postResponse.data,
            errors: null
        }
    }

    @Get('/:userId')
    public async getPostByUser(@Param('userId') userId: string): Promise<ResponsePostGetDto<IPost | IPost[]>> {
        const postResponse: IServicePostSearch<IPost[] | IPost> = await firstValueFrom(
            this.postService.send(MESSAGE_PATTERN.GET_POSTS_BY_USER, userId)
        )

        return {
            message: postResponse.message,
            data: postResponse.data,
            errors: null
        }
    }


    @Post()
    public async createPost(@Body() dto: PostCreateDto): Promise<ResponsePostCreateDto> {
        const postResponse: IServicePostCreate = await firstValueFrom(
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
    public async updatePost(@Body() dto: UserUpdateDto): Promise<ResponsePostUpdate> {
        const postResponse: IServicePostUpdate = await firstValueFrom(
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
    public async deletePost(id: string): Promise<ResponsePostDelete> {
        const postResponse: IServicePostDelete = await firstValueFrom(
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
