import {HttpStatus, Injectable, Logger} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {UserRoleEntity} from "../repository/user-role.entity";
import {Repository} from "typeorm";
import {AssignRoleToUserDto} from "../interfaces/request-dtos/create-user.dto";
import {IUserRole} from "../interfaces/IUserRole";
import {UserRoleResponseDto} from "../interfaces/response-dtos/user-response.dto";
import {MessageEnum} from "../interfaces/message-enums/message.enum";
import {UserRoleLogsEnum} from "../interfaces/message-enums/user-role-logs.enum";

@Injectable()
export class UserRolesService {
    private readonly logger: Logger

    constructor(
        @InjectRepository(UserRoleEntity)
        private readonly userRolesRepository: Repository<IUserRole>
    ) {
        this.logger = new Logger(UserRolesService.name)
    }


    public async assignRoleToUser(dto: AssignRoleToUserDto): Promise<UserRoleResponseDto<IUserRole>> {
        try {

            this.logger.log(UserRoleLogsEnum.ROLE_ASSIGNMENT_INITIATED)
            const newRelation = await this.userRolesRepository.create(dto)
            this.logger.log(UserRoleLogsEnum.ROLE_ASSIGNMENT_SUCCESS)
            return {
                status: HttpStatus.CREATED,
                message: MessageEnum.CREATED,
                data: newRelation
            }
        } catch (e) {
            this.logger.error(UserRoleLogsEnum.ROLE_ASSIGNMENT_ERROR)
            return {
                status: HttpStatus.PRECONDITION_FAILED,
                message: MessageEnum.PRECONDITION_FAILED,
                data: null,
                errors: e
            }
        }

    }

    public async getRoleForUser(userId: string): Promise<UserRoleResponseDto<IUserRole[]>> {
        this.logger.log(UserRoleLogsEnum.ROLE_RETRIEVAL_INITIATED)
        try {

            const relation = await this.userRolesRepository.findBy({userId: userId})

            if (!relation) {
                this.logger.warn(UserRoleLogsEnum.ROLE_RETRIEVAL_NOT_FOUND)
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: MessageEnum.NOT_FOUND,
                    data: null
                }
            }

            this.logger.log(UserRoleLogsEnum.ROLE_RETRIEVAL_SUCCESS)
            return {
                status: HttpStatus.OK,
                message: MessageEnum.OK,
                data: relation
            }
        } catch (e) {
            this.logger.error(UserRoleLogsEnum.ROLE_RETRIEVAL_ERROR)
            return {
                status: HttpStatus.PRECONDITION_FAILED,
                message: MessageEnum.PRECONDITION_FAILED,
                data: null,
                errors: e
            }
        }
    }
}
