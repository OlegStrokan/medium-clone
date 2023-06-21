import {HttpStatus, Injectable, Logger} from '@nestjs/common';
import {Repository} from "typeorm";
import {IRole} from "../interfaces/IRole";
import {CreateRoleDto} from "../interfaces/request-dtos.ts/create-role.dto";
import {MessageEnum} from "../interfaces/message-enums/message-enum";
import {ResponseRoleDto} from "../interfaces/response-dtos.ts/response-role.dto";
import {InjectRepository} from "@nestjs/typeorm";
import {RoleEntity} from "../repository/role.entity";
import {RoleLogsEnum} from "../interfaces/message-enums/role-logs.enum";
import {AssignRoleToUserDto} from "../interfaces/request-dtos.ts/assign-role.dto";
import {IUserRole} from "../interfaces/IUserRole";
import {UserRoleEntity} from "../repository/user-role.entity";

@Injectable()
export class RoleService {
    private readonly logger: Logger;

    constructor(
        @InjectRepository(RoleEntity)
        private readonly roleRepository: Repository<IRole>,
        @InjectRepository(UserRoleEntity)
        private readonly userRoleRepository: Repository<IUserRole>
    ) {
        this.logger = new Logger(RoleService.name)
    }

    public async createRole(dto: CreateRoleDto): Promise<ResponseRoleDto<IRole>> {

        this.logger.log(RoleLogsEnum.CREATE_ROLE_INITIATED)
        try {
            const role = await this.roleRepository.findOneBy({value: dto.value})
            if (role) {
                this.logger.warn(RoleLogsEnum.CREATE_ROLE_CONFLICT)
                return {
                    status: HttpStatus.CONFLICT,
                    message: MessageEnum.CONFLICT,
                    data: null
                }
            }
            const newRole = await this.roleRepository.create(dto)
            await this.roleRepository.save(newRole);

            const response = await this.roleRepository.findOneBy({value: dto.value})

            this.logger.log(RoleLogsEnum.CREATE_ROLE_SUCCESS)
            return {
                status: HttpStatus.CREATED,
                message: MessageEnum.CREATED,
                data: response
            }
        } catch (e) {
            this.logger.error(RoleLogsEnum.CREATE_ROLE_ERROR)
            return {
                status: HttpStatus.PRECONDITION_FAILED,
                message: MessageEnum.PRECONDITION_FAILED,
                data: null,
                errors: e
            }
        }
    }

    public async getRoleByValue(value: string): Promise<ResponseRoleDto<IRole>> {

        this.logger.log(RoleLogsEnum.ROLE_SEARCH_INITIATED)
        try {
            const role = await this.roleRepository.findOneBy({value});

            if (!role) {
                // TODO - update this code
                return await this.createRole({value, description: value})
                /*
                   this.logger.log(RoleLogsEnum.ROLE_NOT_FOUND)
                   return {
                        status: HttpStatus.NOT_FOUND,
                        message: MessageEnum.NOT_FOUND,
                        data: role
                    }*/
            }
            this.logger.log(RoleLogsEnum.ROLE_SEARCH_OK)
            return {
                status: HttpStatus.OK,
                message: MessageEnum.ROLE_SEARCH_OK,
                data: role
            }
        } catch (e) {
            this.logger.error(RoleLogsEnum.ROLE_SEARCH_ERROR)
            return {
                status: HttpStatus.PRECONDITION_FAILED,
                message: MessageEnum.PRECONDITION_FAILED,
                data: null,
                errors: e
            }
        }
    }

    public async getRoles() {

        this.logger.log(RoleLogsEnum.ROLES_SEARCH_INITIATED)
        try {
            const roles = await this.roleRepository.find();

            this.logger.log(RoleLogsEnum.ROLES_SEARCH_OK)
            return {
                status: HttpStatus.OK,
                message: MessageEnum.ROLE_SEARCH_OK,
                data: roles
            }
        } catch (e) {
            this.logger.error(RoleLogsEnum.ROLES_SEARCH_ERROR)
            return {
                status: HttpStatus.PRECONDITION_FAILED,
                message: MessageEnum.PRECONDITION_FAILED,
                data: null,
                errors: e
            }
        }
    }

    public async assignRoleToUser(dto: AssignRoleToUserDto): Promise<ResponseRoleDto<IUserRole>> {
        try {
            this.logger.log(RoleLogsEnum.ROLE_ASSIGNMENT_INITIATED)

            const newRelation = await this.userRoleRepository.create(dto)

            await this.userRoleRepository.save(newRelation)

            this.logger.log(RoleLogsEnum.ROLE_ASSIGNMENT_SUCCESS)
            return {
                status: HttpStatus.CREATED,
                message: MessageEnum.CREATED,
                data: newRelation
            }
        } catch (e) {
            this.logger.error(RoleLogsEnum.ROLE_ASSIGNMENT_ERROR, e)
            return {
                status: HttpStatus.PRECONDITION_FAILED,
                message: MessageEnum.PRECONDITION_FAILED,
                data: null,
                errors: e
            }
        }

    }

    public async getRolesForUser(userId: string): Promise<ResponseRoleDto<IRole[]>> {

        this.logger.log(RoleLogsEnum.ROLE_RETRIEVAL_INITIATED)
        try {
            const relations = await this.userRoleRepository.findBy({userId: userId})

            const rolePromises = relations.map(async (relation) => {
                return await this.getRoleById(relation.roleId);
            });

            const roles = await Promise.all(rolePromises);

            if (!relations) {
                this.logger.warn(RoleLogsEnum.ROLE_RETRIEVAL_NOT_FOUND)
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: MessageEnum.RELATION_NOT_FOUND,
                    data: null
                }
            }

            this.logger.log(RoleLogsEnum.ROLE_RETRIEVAL_SUCCESS)
            return {
                status: HttpStatus.OK,
                message: MessageEnum.ROLE_SEARCH_OK,
                data: roles
            }
        } catch (e) {
            this.logger.error(RoleLogsEnum.ROLE_RETRIEVAL_ERROR)
            return {
                status: HttpStatus.PRECONDITION_FAILED,
                message: MessageEnum.PRECONDITION_FAILED,
                data: null,
                errors: e
            }
        }
    }

    private async getRoleById(roleId: string) {
        return await this.roleRepository.findOneBy({ id: roleId })
    }
}
