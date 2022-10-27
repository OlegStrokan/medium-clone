import {HttpStatus, Injectable} from '@nestjs/common';
import {IPostCreateResponse} from "../interfaces/post-create-response.interface";
import {IPostCreate} from "../interfaces/post-create.interface";
import {IPost} from "../interfaces/post.interface";
import {InjectRepository} from "@nestjs/typeorm";
import {PostEntity} from "../repository/post.entity";
import {Repository} from "typeorm";
import {IPostUpdate} from "../interfaces/post-update.interface";
import {IPostResponse} from "../interfaces/post-response.interface";
import {IPostDelete} from "../interfaces/post-delete.interface";

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(PostEntity) private readonly postRepository: Repository<PostEntity>
    ) {
    }

    public async getPost(id: string): Promise<IPostResponse<IPost>> {
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

    public async getPostsByUser(userId: string): Promise<IPostResponse<IPost[]>> {
        // TODO if user exist
        const posts = await this.postRepository.findBy({ userId })
        if (posts) {
            return {
                status: HttpStatus.CREATED,
                message: 'get_posts_by_user_success',
                data: posts,
            }
        } else {
            return {
                status: HttpStatus.CREATED,
                message: 'get_posts_by_user_not_found',
                data: null
            }
        }
    }

    public async create(dto: IPostCreate): Promise<IPostCreateResponse> {
        // TODO if user exist

        if (true) {
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
        } else {
            return {
                status: HttpStatus.BAD_REQUEST,
                message: 'post_create_bad_request',
                data: null,
                errors: null,
            }
        }
    }

    public async update(dto: IPostUpdate): Promise<IPostResponse<IPost>> {
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

    public async delete(dto: IPostDelete): Promise<IPostResponse<IPost>> {
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
                }
                else {
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
