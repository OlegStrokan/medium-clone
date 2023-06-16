import {HttpStatus, Inject, Injectable, Logger} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {IUser} from '../interfaces/IUser';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {UserEntity} from '../repository/user.entity';
import {UserResponseDto} from '../interfaces/response-dtos/user-response.dto';
import {MessageEnum} from '../interfaces/message-enums/message.enum';
import {CreateUserDto} from '../interfaces/request-dtos/create-user.dto';
import {UpdateUserDto} from '../interfaces/request-dtos/update-user.dto';
import {ValidateUserDto} from '../interfaces/request-dtos/validate-user.dto';
import * as uuid from 'uuid';
import {ActivationLinkEntity} from '../repository/activation-link.entity';
import {IActivationLink} from '../interfaces/IActivationLink';
import {ClientProxy} from '@nestjs/microservices';
import {firstValueFrom} from 'rxjs';
import {MessageRoleEnum} from '../interfaces/message-enums/message-role';
import {IRole} from '../interfaces/IRole';
import {MessageUserRoleEnum} from '../interfaces/message-enums/message-user-role.enum';
import {UserLogsEnum} from '../interfaces/message-enums/user-logs.enum';

@Injectable()
export class UserService {
    private readonly logger: Logger;

    constructor(
        @InjectRepository(UserEntity)
        public readonly userRepository: Repository<IUser>,
        @InjectRepository(ActivationLinkEntity)
        public readonly activationLinkRepository: Repository<IActivationLink>,
        @Inject('role_service') private readonly roleService: ClientProxy,
        @Inject('user_role_service') private readonly userRoleService: ClientProxy,
    ) {
        this.logger = new Logger(UserService.name);
    }

    public async getUser(id: string): Promise<UserResponseDto<IUser>> {
        this.logger.log(UserLogsEnum.USER_INITIATED);

        try {
            const user = await this.searchUserHelper(id, 'id');
            if (!user) {
                this.logger.log(UserLogsEnum.USER_NOT_FOUND);
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: MessageEnum.USER_NOT_FOUND_ID,
                    data: null,
                };
            }

            this.logger.log(UserLogsEnum.USER_RETRIEVED_SUCCESS);
            return {
                status: HttpStatus.OK,
                message: MessageEnum.USER_SEARCH_OK,
                data: user,
            };
        } catch (e) {
            this.logger.log(UserLogsEnum.USER_RETRIEVING_ERROR);
            return {
                status: HttpStatus.PRECONDITION_FAILED,
                message: MessageEnum.PRECONDITION_FAILED,
                data: null,
                errors: e,
            };
        }
    }

    public async getUserByEmail(email: string): Promise<UserResponseDto<IUser>> {
        this.logger.log(UserLogsEnum.USERS_INITIATED);

        try {
            const user = await this.searchUserHelper(email, 'email');
            if (!user) {
                this.logger.log(UserLogsEnum.USER_NOT_FOUND);
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: MessageEnum.USER_NOT_FOUND_EMAIL,
                    data: null,
                };
            }

            this.logger.log(UserLogsEnum.USER_RETRIEVED_SUCCESS);
            return {
                status: HttpStatus.OK,
                message: MessageEnum.USER_SEARCH_OK,
                data: user,
            };
        } catch (e) {
            this.logger.log(UserLogsEnum.USER_RETRIEVING_ERROR);
            return {
                status: HttpStatus.PRECONDITION_FAILED,
                message: MessageEnum.PRECONDITION_FAILED,
                data: null,
                errors: e
            }
        }
    }

    public async validateUser(dto: ValidateUserDto): Promise<UserResponseDto<IUser>> {
        this.logger.log(UserLogsEnum.USER_VALIDATION_INITIATED);

        try {
            const user = await this.searchUserHelper(dto.email, 'email');

            if (!user) {
                this.logger.log(UserLogsEnum.USER_NOT_FOUND);
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: MessageEnum.USER_NOT_FOUND_ID,
                    data: null,
                };
            }

            if (user && (await bcrypt.compare(dto.password, user.password))) {
                this.logger.log(UserLogsEnum.USER_VALIDATION_SUCCESS);
                return {
                    status: HttpStatus.OK,
                    message: MessageEnum.USER_SEARCH_OK,
                    data: user,
                };
            } else {
                this.logger.log(UserLogsEnum.USER_VALIDATION_FAILED);
                return {
                    status: HttpStatus.UNAUTHORIZED,
                    message: MessageEnum.UNAUTHORIZED,
                    data: null,
                };
            }
        } catch (e) {
            this.logger.log(UserLogsEnum.USER_VALIDATION_ERROR);
            return {
                status: HttpStatus.PRECONDITION_FAILED,
                message: MessageEnum.PRECONDITION_FAILED,
                data: null,
            };
        }
    }

    public async getUsers(): Promise<UserResponseDto<IUser[]>> {
        this.logger.log(UserLogsEnum.USERS_INITIATED);

        try {
            const users = await this.userRepository.find();

            this.logger.log(UserLogsEnum.USERS_RETRIEVED_SUCCESS);
            return {
                status: HttpStatus.OK,
                message: MessageEnum.USER_SEARCH_OK,
                data: users,
            };
        } catch (e) {
            this.logger.log(UserLogsEnum.USERS_RETRIEVING_ERROR);
            return {
                status: HttpStatus.PRECONDITION_FAILED,
                message: MessageEnum.PRECONDITION_FAILED,
                data: null,
            };
        }
    }

    public async createUser(dto: CreateUserDto): Promise<UserResponseDto<IUser>> {

        this.logger.log(UserLogsEnum.USER_CREATION_INITIATED);

        const existingUser = await this.userRepository.findOne({
            where: {email: dto.email},
        });

        if (existingUser) {
            this.logger.log(UserLogsEnum.USER_CREATION_CONFLICT);
            return {
                status: HttpStatus.CONFLICT,
                message: MessageEnum.USER_CONFLICT,
                data: null,
                errors: {
                    messages: [MessageEnum.USER_CONFLICT],
                },
            };
        }

        try {
            const hashPassword = await UserService.hashPassword(dto.password);

            const user = await this.userRepository.create({
                ...dto,
                password: hashPassword,
            });
            await this.userRepository.save(user);

            const activationLink = await this.activationLinkRepository.create({
                userId: user.id,
                link: uuid.v4(),
            });

            await this.activationLinkRepository.save(activationLink);

            const roleServiceResponse: UserResponseDto<IRole> = await firstValueFrom(
                this.roleService.send(MessageRoleEnum.ROLE_GET_BY_VALUE, 'admin'),
            );

            await firstValueFrom(
                this.userRoleService.send(
                    MessageUserRoleEnum.ROLE_ASSIGN_TO_USER,
                    JSON.stringify({userId: user.id, roleId: roleServiceResponse.data.id}),
                ),
            );

            const response = await this.userRepository
                .createQueryBuilder('user')
                .leftJoinAndSelect('user.activationLink', 'activationLink')
                .select([
                    'user.id',
                    'user.fullName',
                    'user.userName',
                    'user.email',
                    'activationLink.link',
                ])
                .getOne();

            this.logger.log(UserLogsEnum.USER_CREATED);

            return {
                status: HttpStatus.CREATED,
                message: MessageEnum.USER_CREATED,
                data: response,
            };
        } catch (e) {

            this.logger.log(UserLogsEnum.USER_CREATION_ERROR);

            return {
                status: HttpStatus.PRECONDITION_FAILED,
                message: MessageEnum.PRECONDITION_FAILED,
                data: null,
                errors: e,
            };
        }
    }

    public async updateUser(dto: UpdateUserDto): Promise<UserResponseDto<IUser>> {
        this.logger.log(UserLogsEnum.USER_UPDATE_INITIATED);

        try {
            const user = await this.searchUserHelper(dto.id, 'id');
            if (!user) {
                this.logger.log(UserLogsEnum.USER_NOT_FOUND);
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: MessageEnum.USER_NOT_FOUND_ID,
                    data: null,
                };
            }

            await this.userRepository.update(dto.id, dto);

            const updatedUser = await this.searchUserHelper(dto.id, 'id');

            this.logger.log(UserLogsEnum.USER_UPDATED_SUCCESS);
            return {
                status: HttpStatus.OK,
                message: MessageEnum.USER_UPDATED,
                data: updatedUser,
            };
        } catch (e) {
            this.logger.log(UserLogsEnum.USER_UPDATE_ERROR);
            return {
                status: HttpStatus.PRECONDITION_FAILED,
                message: MessageEnum.PRECONDITION_FAILED,
                data: null,
                errors: e,
            };
        }
    }

    public async deleteUser(id: string): Promise<UserResponseDto<IUser>> {
        this.logger.log(UserLogsEnum.USER_DELETION_INITIATED);

        try {
            const user = await this.searchUserHelper(id, 'id');
            if (!user) {
                this.logger.log(UserLogsEnum.USER_NOT_FOUND);
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: MessageEnum.USER_NOT_FOUND_ID,
                    data: null,
                };
            }

            await this.userRepository.delete(id);

            this.logger.log(UserLogsEnum.USER_DELETED);
            return {
                status: HttpStatus.OK,
                message: MessageEnum.USER_DELETED,
                data: null,
            };
        } catch (e) {
            this.logger.log(UserLogsEnum.USER_DELETION_ERROR);
            return {
                status: HttpStatus.PRECONDITION_FAILED,
                message: MessageEnum.PRECONDITION_FAILED,
                data: null,
                errors: e,
            };
        }
    }

    private async searchUserHelper(value: string, field: string): Promise<IUser | undefined> {
        return this.userRepository.findOne({where: {[field]: value}});
    }

    private static async hashPassword(password: string): Promise<string> {
        const saltRounds = 10;
        return bcrypt.hash(password, saltRounds);
    }
}

