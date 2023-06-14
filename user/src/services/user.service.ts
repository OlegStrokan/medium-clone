import {HttpStatus, Inject, Injectable} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {IUser} from "../interfaces/IUser";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {UserEntity} from "../repository/user.entity";
import {UserResponseDto} from "../interfaces/response-dtos/user-response.dto";
import {MessageEnum} from "../interfaces/message-enums/message.enum";
import {CreateUserDto} from "../interfaces/request-dtos/create-user.dto";
import {UpdateUserDto} from "../interfaces/request-dtos/update-user.dto";
import {ValidateUserDto} from "../interfaces/request-dtos/validate-user.dto";
import * as uuid from 'uuid'
import {ActivationLinkEntity} from "../repository/activationLink.entity";
import {IActivationLink} from "../interfaces/IActivationLink";
import {ClientProxy} from "@nestjs/microservices";
import {firstValueFrom} from "rxjs";
import {MessageRoleEnum} from "../interfaces/message-enums/message-role";
import {IRole} from "../interfaces/IRole";
import {MessageUserRoleEnum} from "../interfaces/message-enums/message-user-role.enum";

Injectable()

export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        public readonly userRepository: Repository<IUser>,
        @InjectRepository(ActivationLinkEntity)
        public readonly activationLinkRepository: Repository<IActivationLink>,
        @Inject('role_service') private readonly roleService: ClientProxy,
        @Inject('user_role_service') private readonly userRoleService: ClientProxy
    ) {
    }

    public async getUser(id: string): Promise<UserResponseDto<IUser>> {

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
                data: null,
                errors: e,
            };
        }
    }

    public async getUserByEmail(email: string): Promise<UserResponseDto<IUser>> {

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
                data: null,
                errors: e
            };
        }
    }

    public async validateUser(dto: ValidateUserDto): Promise<UserResponseDto<IUser>> {

        try {

            const user = await this.searchUserHelper(dto.email, 'email');

            if (!user) {
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: MessageEnum.USER_NOT_FOUND_ID,
                    data: null
                }
            }

            if (user && await bcrypt.compare(dto.password, user.password)) {
                return {
                    status: HttpStatus.OK,
                    message: MessageEnum.USER_SEARCH_OK,
                    data: user
                }
            } else {
                return {
                    status: HttpStatus.UNAUTHORIZED,
                    message: MessageEnum.UNAUTHORIZED,
                    data: null
                }
            }
        } catch (e) {
            return {
                status: HttpStatus.PRECONDITION_FAILED,
                message: MessageEnum.PRECONDITION_FAILED,
                data: null,
            }
        }

    }

    public async getUsers(): Promise<UserResponseDto<IUser[]>> {

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

    public async createUser(dto: CreateUserDto): Promise<UserResponseDto<IUser>> {
        const existingUser = await this.userRepository.findOne({where: {email: dto.email}});

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
            const hashPassword = await UserService.hashPassword(dto.password)

            const user = await this.userRepository.create({...dto, password: hashPassword,});
            await this.userRepository.save(user);

            const activationLink = await this.activationLinkRepository.create({userId: user.id, link: uuid.v4()})

            await this.activationLinkRepository.save(activationLink);

            const roleServiceResponse: UserResponseDto<IRole> = await firstValueFrom(
                this.roleService.send(MessageRoleEnum.ROLE_GET_BY_VALUE, "admin")
            )

           await firstValueFrom(this.userRoleService.send(
               MessageUserRoleEnum.ROLE_ASSIGN_TO_USER, JSON.stringify({ userId: user.id, roleId: roleServiceResponse.data.id }))
           )




            const response = await this.userRepository.createQueryBuilder('user')
                .leftJoinAndSelect('user.activationLink', 'activationLink')
                .select([
                    'user.id',
                    'user.fullName',
                    'user.userName',
                    'user.email',
                    'activationLink.link'
                ])
                .getOne();



            return {
                status: HttpStatus.CREATED,
                message: MessageEnum.USER_CREATED,
                data: {
                    ...response,
                    roles: [roleServiceResponse.data.value]
                }
            }

        } catch (error) {
            return {
                status: HttpStatus.PRECONDITION_FAILED,
                message: MessageEnum.PRECONDITION_FAILED,
                data: null,
            }
        }

    }

    public async updateUser(dto: UpdateUserDto): Promise<UserResponseDto<IUser>> {

        const user = await this.searchUserHelper(dto.id, 'id');

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

    public async deleteUser(id: string): Promise<UserResponseDto<null>> {
        try {

            const user = this.searchUserHelper(id, 'id')

            if (!user) {
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: MessageEnum.USER_NOT_FOUND_ID,
                    data: null,
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
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }
}
