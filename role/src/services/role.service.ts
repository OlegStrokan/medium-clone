import {HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {RoleEntity} from "../repository/role.entity";
import {Repository} from "typeorm";
import {ICreateRole} from "../interfaces/create-role.interface";
import {IRoleCreateResponse} from "../interfaces/user-create-response.interface";
import {IRole} from "../interfaces/role.interface";
import {IRoleSearchResponse} from "../interfaces/user-search-response.interface";

@Injectable()
export class RoleService {

    constructor(@InjectRepository(RoleEntity) private readonly roleRepository: Repository<RoleEntity>) {
    }

    public async create(dto: ICreateRole): Promise<IRoleCreateResponse> {
        if (dto) {
            const role = await this.roleRepository.findOne({where: {value: dto.value}})
            if (role) {
                return {
                    status: HttpStatus.CONFLICT,
                    message: 'user_create_conflict',
                    data: null,
                    errors: {
                        value: {
                            message: 'this role already exist',
                            path: 'value'
                        }
                    }
                }
            } else {
                try {
                    const newRole = await this.roleRepository.create(dto);
                    return {
                        status: HttpStatus.CREATED,
                        message: 'role_create_success',
                        data: newRole,
                        errors: null,
                    }
                } catch (e) {
                    return {
                        status: HttpStatus.PRECONDITION_FAILED,
                        message: 'role_create_precondition_created',
                        data: null,
                        errors: e.errors
                    }
                }
            }
        } else {
            return {
                status: HttpStatus.BAD_REQUEST,
                message: 'role_create_bad_request',
                data: null,
                errors: null,
            }
        }
    }

    public async getRoleByValue(value: string): Promise<IRoleSearchResponse<IRole>> {
        if (value) {
            const newValue = await this.roleRepository.findOne({where: {value}})
            if (newValue) {
                return {
                    status: HttpStatus.OK,
                    message: 'role_search_by_value_success',
                    data: newValue
                }
            } else {
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: 'role_search_by_value_not_found',
                    data: null,
                }
            }
        }
    }

    public async getRoles(): Promise<IRoleSearchResponse<IRole[]>> {
            const roles = await this.roleRepository.find();
            if (roles) {
                return {
                    status: HttpStatus.OK,
                    message: 'roles_get_success',
                    data: roles
                }
            } else {
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: 'roles_get_not_found',
                    data: null
                }
            }
    }
}
