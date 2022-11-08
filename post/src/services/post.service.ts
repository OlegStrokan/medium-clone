import {HttpStatus, Inject, Injectable} from '@nestjs/common';
import {IPostCreateResponse} from "../interfaces/response-dto/ResponsePostCreateDto";
import {PostCreateDto} from "../interfaces/dto/PostCreateDto";
import {IPost} from "../interfaces/IPost";
import {InjectRepository} from "@nestjs/typeorm";
import {PostEntity} from "../repository/post.entity";
import {Repository} from "typeorm";
import {PostUpdateDto} from "../interfaces/dto/PostUpdateDto";
import {ResponsePostDto} from "../interfaces/response-dto/ResponsePostDto";
import {PostDeleteDto} from "../interfaces/dto/PostDeleteDto";
import {ClientProxy} from "@nestjs/microservices";
import {firstValueFrom} from "rxjs";
import {ResponseUserSearchDto} from "../interfaces/response-dto/ResponseUserSearchDto";

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(PostEntity) private readonly postRepository: Repository<PostEntity>,
        @Inject('USER_SERVICE') private readonly mailerServiceClient: ClientProxy
    ) {
    }

    public async getPost(id: string): Promise<ResponsePostDto<IPost>> {
        const post = await this.postRepository.findOneBy({id});
        if (post) {
            return {
                status: HttpStatus.OK,
                message: 'get_post_success',
                data: post
            }
        } else {
            return {
                status: HttpStatus.NOT_FOUND,
                message: 'get_post_not_found',
                data: null
            }
        }
    }

    public async getPostsByUser(userId: string): Promise<ResponsePostDto<IPost[]>> {

        const userResponse: ResponseUserSearchDto = await firstValueFrom(this.mailerServiceClient.send('SEARCH_USER_BY_ID', userId))

        if (userResponse.status !== HttpStatus.OK) {
            return {
                status: HttpStatus.NOT_FOUND,
                message: 'get_posts_by_user_not_found',
                data: null
            }
        } else {

            const posts = await this.postRepository.findBy({userId})
            if (posts) {
                return {
                    status: HttpStatus.CREATED,
                    message: 'get_posts_by_user_success',
                    data: posts,
                }
            } else {
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: 'get_posts_by_user_not_found',
                    data: null
                }
            }
        }
    }

    public async create(dto: PostCreateDto): Promise<IPostCreateResponse> {
        const userResponse: ResponseUserSearchDto = await firstValueFrom(this.mailerServiceClient.send('SEARCH_USER_BY_ID', dto.userId))

        if (userResponse.status !== HttpStatus.OK) {
            return {
                status: HttpStatus.NOT_FOUND,
                message: 'get_posts_by_user_not_found',
                data: null,
                errors: null,
            }
        } else {
            try {
                const post = this.postRepository.create(dto)
                await this.postRepository.save(post);

                return {
                    status: HttpStatus.CREATED,
                    message: 'post_create_success',
                    data: post,
                    errors: null
                }
            } catch (e) {
                return {
                    status: HttpStatus.PRECONDITION_FAILED,
                    message: 'post_create_precondition_failed',
                    data: null,
                    errors: e.errors
                }
            }
        }
    }

    public async update(dto: PostUpdateDto): Promise<ResponsePostDto<IPost>> {
        const post = await this.searchPostHelper(dto.id, dto);

        if (post) {
            if (post.userId === dto.userId) {
                await this.postRepository.save({
                    title: dto.title,
                    content: dto.content
                })

                const updatedPost = await this.searchPostHelper(dto.id, dto);
                return {
                    status: HttpStatus.OK,
                    message: 'update_post_success',
                    data: updatedPost
                }
            } else {
                return {
                    status: HttpStatus.FORBIDDEN,
                    message: 'update_post_forbidden',
                    data: null
                }
            }
        } else {
            return {
                status: HttpStatus.NOT_FOUND,
                message: 'update_post_not_found',
                data: null
            }
        }
    }

    public async delete(dto: PostDeleteDto): Promise<ResponsePostDto<IPost>> {
        try {
            const post = await this.searchPostHelper(dto.id, dto);
            if (post) {
                if (post.id === dto.id) {
                    await this.postRepository.delete({id: dto.id})
                    return {
                        status: HttpStatus.ACCEPTED,
                        message: 'delete_post_success',
                        data: null
                    }
                } else {
                    return {
                        status: HttpStatus.FORBIDDEN,
                        message: 'delete_post_forbidden',
                        data: null
                    }
                }
            } else {
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: 'delete_post_not_found',
                    data: null
                }
            }

        } catch (e) {
            return {
                status: HttpStatus.FORBIDDEN,
                message: 'delete_post_forbidden',
                data: null
            };

        }
    }


    private async searchPostHelper(value, dto): Promise<IPost> {
        return await this.postRepository.findOneBy({[value]: dto[value]})
    }


    private async getPostByUser() {

    }
}
