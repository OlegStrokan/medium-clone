import { Controller, Get } from '@nestjs/common';
import { RoleService } from './services/role.service';
import {ICreateRole} from "./interfaces/create-role.interface";
import {IRoleCreateResponse} from "./interfaces/user-create-response.interface";
import {IRoleSearchResponse} from "./interfaces/user-search-response.interface";
import {IRole} from "./interfaces/role.interface";

@Controller()
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  public async create(dto: ICreateRole): Promise<IRoleCreateResponse> {
    return this.roleService.create(dto);
  }

  public async getRoleByValue(value: string): Promise<IRoleSearchResponse<IRole>> {
    return this.roleService.getRoleByValue(value);
  }

  public async getRoles(): Promise<IRoleSearchResponse<IRole[]>> {
    return this.roleService.getRoles()
  }
}
