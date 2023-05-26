import {HttpStatus, Injectable} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {IUser} from "../interfaces/IUser";
import {InjectRepository} from "@nestjs/typeorm";
import {EntityNotFoundError, Repository} from "typeorm";
import {UserEntity} from "../repository/user.entity";
import {UserResponseDto} from "../interfaces/response-dtos/user-response.dto";
import {MessageEnum} from "../interfaces/message-enums/message.enum";
import {CreateUserDto} from "../interfaces/request-dtos/create-user.dto";
import {UpdateUserDto} from "../interfaces/request-dtos/update-user.dto";
import {UsersResponseDto} from "../interfaces/response-dtos/users-response.dto";

Injectable()

export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        public readonly userRepository: Repository<IUser>
    ) {
    }

    async getUser(id: string): Promise<UserResponseDto> {

        try {
            const user = await this.searchUserHelper(id, 'id');
            if (!user) {
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: MessageEnum.USER_NOT_FOUND_ID,
                    data: null,
                }
            }

            return {
                status: HttpStatus.OK,
                message: MessageEnum.USER_SEARCH_OK,
                data: user
            }
        } catch (e) {
            return {
                status: HttpStatus.PRECONDITION_FAILED,
                message: MessageEnum.PRECONDITION_FAILED,
                data: e,
            };
        }
    }

    async getUserByEmail(email: string): Promise<UserResponseDto> {

        try {
            const user = await this.searchUserHelper(email, 'email');
            if (!user) {
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: MessageEnum.USER_NOT_FOUND_EMAIL,
                    data: null,
                }
            }

            return {
                status: HttpStatus.OK,
                message: MessageEnum.USER_SEARCH_OK,
                data: user
            }
        } catch (e) {
            return {
                status: HttpStatus.PRECONDITION_FAILED,
                message: MessageEnum.PRECONDITION_FAILED,
                data: e,
            };
        }
    }

    async getUsers(): Promise<UsersResponseDto> {

        try {
            const users = await this.userRepository.find();

            return {
                status: HttpStatus.OK,
                message: MessageEnum.USER_SEARCH_OK,
                data: users
            }
        } catch (e) {
            return {
                status: HttpStatus.PRECONDITION_FAILED,
                message: MessageEnum.PRECONDITION_FAILED,
                data: null
            }
        }
    }

    async createUser(dto: CreateUserDto): Promise<UserResponseDto> {
        const existingUser = await this.userRepository.findOne({where: {email: dto.email}});
        console.log(existingUser)

        if (existingUser) {
            return {
                status: HttpStatus.CONFLICT,
                message: MessageEnum.USER_CONFLICT,
                data: null,
                errors: {
                    messages: [MessageEnum.USER_CONFLICT]
                }
            }
        }
        try {
            console.log('test 2 ')
            const hashPassword = await UserService.hashPassword(dto.password)
            console.log(dto, hashPassword)
            const newUser = await this.userRepository.create({...dto, password: hashPassword});
            const user = await this.userRepository.save(newUser);

            return {
                status: HttpStatus.CREATED,
                message: MessageEnum.USER_CREATED,
                data: user
            }

        } catch (error) {
            return {
                status: HttpStatus.PRECONDITION_FAILED,
                message: MessageEnum.PRECONDITION_FAILED,
                data: null,
            }
        }

    }

    async updateUser(dto: UpdateUserDto): Promise<UserResponseDto> {

        const user = await this.searchUserHelper('id', dto.id);

        if (!user) {
            return {
                status: HttpStatus.NOT_FOUND,
                message: MessageEnum.USER_NOT_FOUND_ID,
                data: null,
            }
        } else {
            try {
                Object.assign(user, dto);
                const updatedUser = await this.userRepository.save(user);

                return {
                    status: HttpStatus.OK,
                    message: MessageEnum.USER_UPDATED,
                    data: updatedUser
                }

            } catch (e) {
                return {
                    status: HttpStatus.PRECONDITION_FAILED,
                    message: MessageEnum.PRECONDITION_FAILED,
                    data: null,
                }
            }
        }
    }

    async deleteUser(id: string): Promise<UserResponseDto> {
        try {

            const user = this.searchUserHelper(id, 'id')

            if (!user) {

                return {
                    status: HttpStatus.NOT_FOUND,
                    message: MessageEnum.USER_NOT_FOUND_ID,
                    data: null
                }
            }

            await this.userRepository.delete(id);

            return {
                status: HttpStatus.NO_CONTENT,
                message: MessageEnum.USER_DELETED,
                data: null
            }



        } catch (e) {
            return {
                status: HttpStatus.PRECONDITION_FAILED,
                message: MessageEnum.PRECONDITION_FAILED,
                data: null,
            }
        }
    }

    private async searchUserHelper(dto, value): Promise<IUser> {
        return await this.userRepository.findOneBy({[value]: dto})
    }

    private static async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10)
        console.log(salt, password)
        const password2 = await bcrypt.hash(password, salt);
        console.log(password2)
        return password2;
    }

    private async validateUser(email: string, password: string): Promise<IUser> {
        const user = await this.searchUserHelper(email, 'email');

        if (user && await bcrypt.compare(password, user.password)) {
            return user
        }
        return null
    }
}
