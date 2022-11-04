import {HttpStatus, Injectable} from '@nestjs/common';
import {IUser} from 'src/interfaces/IUser';
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "../repository/user.entity";
import {Repository} from "typeorm";
import {UserCreateDto} from "../interfaces/dto/UserCreateDto";
import {ResponseUserCreateDto} from "../interfaces/response-dto/ResponseUserCreateDto";
import {ResponseUserDto} from "../interfaces/response-dto/ResponseUserDto";
import * as bcrypt from 'bcrypt'
import {UserUpdatePasswordDto} from "../interfaces/dto/UserUpdatePasswordDto";
import {UserSearchDto} from "../interfaces/dto/UserSearchDto";
import {UserUpdateDto} from "../interfaces/dto/UserUpdateDto";

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>
    ) {
    }

    public async createUser(dto: UserCreateDto): Promise<ResponseUserCreateDto> {
        if (dto) {
            const existUser = await this.searchUserHelper(dto.email, dto);

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

    //login
    public async searchUserByCredentials(dto: UserSearchDto): Promise<ResponseUserDto> {
        if (dto.email && dto.password) {
            const user = await this.searchUserHelper(dto.email, dto);

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

    public async searchUserById(id: string): Promise<ResponseUserDto> {
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

    public async updateUser(dto: UserUpdateDto): Promise<ResponseUserDto> {
        const user = await this.searchUserHelper(dto.id, dto);

        if (user) {
            await this.userRepository.save(
                {
                    email: dto.email,
                    username: dto.username,
                    fullname: dto.fullname,
                })

            const updatedUser = await this.searchUserHelper(dto.id, dto);

            return {
                status: HttpStatus.OK,
                message: 'update_user_success',
                data: updatedUser

            }
        } else {
            return {
                status: HttpStatus.NOT_FOUND,
                message: 'update_user_not_found',
                data: null
            }
        }

    }

    public async updatePassword(dto: UserUpdatePasswordDto): Promise<ResponseUserDto> {
        const user = await this.searchUserHelper(dto.id, dto);
        if (bcrypt.compare(dto.oldPassword, user.password)) {
            await this.userRepository.save({
                password: dto.newPassword
            })

            const updatedUser = await this.searchUserHelper(dto.id, dto);

            return {
                status: HttpStatus.OK,
                message: 'update_user_success',
                data: updatedUser

            }
        } else {
            return {
                status: HttpStatus.NOT_FOUND,
                message: 'update_user_not_found',
                data: null
            }
        }
    }

    //----------------------------------------------------------------------------------------------------//
    private async searchUserHelper(value, dto): Promise<IUser> {
        return await this.userRepository.findOneBy({[value]: dto[value]})
    }

    private static async compareEncryptedPassword(password: string, passwordFromDb: string): Promise<boolean> {
        return bcrypt.compare(password, passwordFromDb)

    }
}
