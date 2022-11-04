import { Controller, Get } from '@nestjs/common';
import { RoleService } from './services/role.service';
import {CreateRoleDto} from "./interfaces/dto/CreateRoleDto";
import {ResponseRoleCreateDto} from "./interfaces/response-dto/ResponseRoleCreateDto";
import {ResponseRoleSearchDto} from "./interfaces/response-dto/ResponseRoleSearchDto";
import {IRole} from "./interfaces/IRole";

@Controller()
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  public async create(dto: CreateRoleDto): Promise<ResponseRoleCreateDto> {
    return this.roleService.create(dto);
  }

  public async getRoleByValue(value: string): Promise<ResponseRoleSearchDto<IRole>> {
    return this.roleService.getRoleByValue(value);
  }

  public async getRoles(): Promise<ResponseRoleSearchDto<IRole[]>> {
    return this.roleService.getRoles()
  }
}
