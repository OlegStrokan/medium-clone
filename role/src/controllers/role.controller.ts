import {Controller, Get, Inject} from '@nestjs/common';
import {RoleService} from '../services/role.service';
import {MessagePattern} from "@nestjs/microservices";
import {MessagePatternEnum} from "../interfaces/message-enums/message-pattern.enum";
import {ResponseRoleDto} from "../interfaces/response-dtos.ts/response-role.dto";
import {IRole} from "../interfaces/IRole";

@Controller()
export class RoleController {
    constructor(private readonly roleService: RoleService) {
    }

    @MessagePattern(MessagePatternEnum.ROLE_CREATE)
    createRole(jsonDto: string): Promise<ResponseRoleDto<IRole>> {
        return this.roleService.createRole(JSON.parse(jsonDto))
    }

    @MessagePattern(MessagePatternEnum.ROLE_GET_BY_VALUE)
    getRoleByValue(value: string): Promise<ResponseRoleDto<IRole>> {
        return this.roleService.getRoleByValue(value);
    }

    @MessagePattern(MessagePatternEnum.ROLE_GET_ALL)
    getRoles(): Promise<ResponseRoleDto<IRole[]>> {
        return this.roleService.getRoles();
    }
}
