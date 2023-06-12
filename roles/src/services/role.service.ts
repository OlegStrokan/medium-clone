import {HttpStatus, Inject, Injectable} from '@nestjs/common';
import {Repository} from "typeorm";
import {IRole} from "../interfaces/IRole";
import {CreateRoleDto} from "../interfaces/request-dtos.ts/create-role.dto";
import {MessageEnum} from "../interfaces/message-enums/message-enum";
import {ResponseRoleDto} from "../interfaces/response-dtos.ts/response-role.dto";

@Injectable()
export class RoleService {
    constructor(
        @Inject()
        private readonly roleRepository: Repository<IRole>
    ) {
    }

    public async createRole(dto: CreateRoleDto): Promise<ResponseRoleDto<IRole>> {
            try {
                const role = await this.roleRepository.findOneBy({value: dto.value})
                if (role) {
                    return {
                        status: HttpStatus.CONFLICT,
                        message: MessageEnum.CONFLICT,
                        data: null
                    }
                }
                await this.roleRepository.create(dto)

                const response = await this.roleRepository.findOneBy({value: dto.value})
                return {
                    status: HttpStatus.CREATED,
                    message: MessageEnum.CREATED,
                    data: response
                }
            } catch (e) {
                return {
                    status: HttpStatus.PRECONDITION_FAILED,
                    message: MessageEnum.PRECONDITION_FAILED,
                    data: null,
                    errors: e
                }
            }
    }

    public async getRoleByValue(value: string): Promise<ResponseRoleDto<IRole>> {
        try {
            const role = await this.roleRepository.findOneBy({value});

            if (!role) {
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: MessageEnum.ROLE_SEARCH_OK,
                    data: role
                }
            }
            return {
                status: HttpStatus.OK,
                message: MessageEnum.ROLE_SEARCH_OK,
                data: role
            }
        } catch (e) {
            return {
                status: HttpStatus.PRECONDITION_FAILED,
                message: MessageEnum.PRECONDITION_FAILED,
                data: null,
                errors: e
            }
        }
    }

    public async getRoles() {

        try {
            const roles = await this.roleRepository.find();

            return {
                status: HttpStatus.OK,
                message: MessageEnum.ROLE_SEARCH_OK,
                data: roles
            }
        } catch (e) {
            return {
                status: HttpStatus.PRECONDITION_FAILED,
                message: MessageEnum.PRECONDITION_FAILED,
                data: null,
                errors: e
            }
        }
    }
}
