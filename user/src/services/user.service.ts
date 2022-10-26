import {HttpStatus, Injectable} from '@nestjs/common';
import {IUser} from 'src/interfaces/user.interface';
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "../repository/user.entity";
import {Repository} from "typeorm";
import {IUserCreate} from "../interfaces/user-create.interface";
import {IUserCreateResponse} from "../interfaces/user-create-response.interface";
import {IUserSearch} from "../interfaces/user-search.interface";
import {IUserSearchResponse} from "../interfaces/user-search-response.interface";
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>
    ) {
    }

    public async createUser(dto: IUserCreate): Promise<IUserCreateResponse> {
        if (dto) {
            const existUser = await this.searchUserByEmail(dto.email)

            if (existUser) {
                return {
                    status: HttpStatus.CONFLICT,
                    message: 'user_create_conflict',
                    data: null,
                    errors: {
                        email: {
                            message: 'Email already exist',
                            path: 'email'
                        }
                    }
                }
            } else {
                try {
                    const newUser = await this.userRepository.create(dto);
                    await this.userRepository.save(newUser);
                    return {
                        status: HttpStatus.CREATED,
                        message: 'user_create_success',
                        data: newUser,
                        errors: null
                    }
                } catch (e) {
                    return {
                        status: HttpStatus.PRECONDITION_FAILED,
                        message: 'user_create_precondition_failed',
                        data: null,
                        errors: e.errors
                    }
                }
            }
        } else {
            return {
                status: HttpStatus.BAD_REQUEST,
                message: 'user_create_bad_request',
                data: null,
                errors: null,
            }
        }
    }

    public async searchUserByCredentials(dto: IUserSearch): Promise<IUserSearchResponse> {
        if (dto.email && dto.password) {
            const user = await this.searchUserByEmail(dto.email);

            if (user) {
                if (await UserService.compareEncryptedPassword(dto.password, user.password)) {
                    return {
                        status: HttpStatus.OK,
                        message: 'user_search_by_credentials_success',
                        data: user,
                    }
                } else {
                    return {
                        status: HttpStatus.NOT_FOUND,
                        message: 'user_search_by_credentials_not_match',
                        data: null,
                    }
                }
            } else {
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: 'user_search_by_credentials_not_found',
                    data: null
                }
            }
        } else {
            return {
                status: HttpStatus.NOT_FOUND,
                message: 'user_search_by_credentials_not_found',
                data: null
            }
        }
    }

    public async searchUserById(id: string): Promise<IUserSearchResponse> {
        const user: IUser = await this.userRepository.findOneBy({id});
        if (user) {
            return {
                status: HttpStatus.OK,
                message: 'user_search_by_id_success',
                data: user,
            }
        } else {
            return {
                status: HttpStatus.NOT_FOUND,
                message: 'user_search_by_id_not_found',
                data: null
            }
        }

    }

    private async searchUserByEmail(email: string): Promise<IUser> {
        return await this.userRepository.findOne({where: {email}})
    }

    private static async compareEncryptedPassword(password: string, passwordFromDb: string): Promise<boolean> {
        return bcrypt.compare(password, passwordFromDb)

    }
}
