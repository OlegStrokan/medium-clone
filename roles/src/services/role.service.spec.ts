import {RoleService} from "./role.service";
import {Repository} from "typeorm";
import {IRole} from "../interfaces/IRole";
import {Test, TestingModule} from "@nestjs/testing";
import {getRepositoryToken} from "@nestjs/typeorm";
import {RoleEntity} from "../repository/role.entity";
import {HttpStatus} from "@nestjs/common";
import {MessageEnum} from "../interfaces/message-enums/message-enum";
import {ResponseRoleDto} from "../interfaces/response-dtos.ts/response-role.dto";

describe('Role service tests', () => {
    let roleService: RoleService;
    let roleRepository: Repository<IRole>

    const role: IRole = {
        id: '93',
        value: 'admin',
        description: 'Role for admit. Allow to do everything'
    }

    const roleDto = {
        value: 'admin',
        description: 'Role for admin'
    }


    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RoleService,
                {
                    provide: getRepositoryToken(RoleEntity),
                    useClass: Repository
                }
            ]
        }).compile();

        roleService = module.get<RoleService>(RoleService);
        roleRepository = module.get<RoleEntity>(RoleEntity);
    })

    describe('createRole', () => {
        it('should return role with status OK when role hasn\'t been created yet', async () => {
            jest.spyOn(roleRepository, 'findOneBy').mockResolvedValue(null);
            jest.spyOn(roleRepository, 'create').mockReturnValue(role);
            jest.spyOn(roleRepository, 'save').mockResolvedValue(role);

            const result = await roleService.createRole(roleDto);

            expect(roleRepository.findOneBy).toHaveBeenCalledWith({ value: roleDto.value });
            expect(roleRepository.create).toHaveBeenCalledWith(roleDto);
            expect(roleRepository.save).toHaveBeenCalledWith(role);
            expect(result).toEqual({
                status: HttpStatus.CREATED,
                message: MessageEnum.CREATED,
                data: result.data,
            });
        });

        it('should return conflict error when role already created', async () => {
            jest.spyOn(roleRepository, 'findOneBy').mockResolvedValue(role);

            const result = await roleService.createRole(roleDto)

            expect(roleRepository.findOneBy).toHaveBeenCalledWith({ value: roleDto.value })
            expect(result).toEqual<ResponseRoleDto<null>>({
                status: HttpStatus.CONFLICT,
                message: MessageEnum.CONFLICT,
                data: null
            })
        });

        it('should return precondition failed error', async () => {
            const error = new Error('Some error');
            jest.spyOn(roleRepository, 'findOneBy').mockRejectedValue(error)

            const result = await roleService.createRole(roleDto);

            expect(roleRepository.findOneBy).toHaveBeenCalledWith({ value: roleDto.value })
            expect(result).toEqual({
                status: HttpStatus.PRECONDITION_FAILED,
                message: MessageEnum.PRECONDITION_FAILED,
                data: null,
                errors: error
            })
        });
    })

    describe('getRoleByValue', () => {
        it('should return role with status OK when role exist', async () => {

            jest.spyOn(roleRepository, 'findOneBy').mockResolvedValue(role);

            const result = await roleService.getRoleByValue(role.value);

            expect(roleRepository.findOneBy).toHaveBeenCalledWith({ value: role.value })
            expect(result).toEqual<ResponseRoleDto<IRole>>({
                status: HttpStatus.OK,
                message: MessageEnum.ROLE_SEARCH_OK,
                data: result.data
            })
        });

        it('should return not found when role not exist', async () => {
            jest.spyOn(roleRepository, 'findOneBy').mockResolvedValue(null);

            const result = await roleService.getRoleByValue(role.value);

            expect(roleRepository.findOneBy).toHaveBeenCalledWith({ value: role.value })
            expect(result).toEqual<ResponseRoleDto<IRole>>({
                status: HttpStatus.NOT_FOUND,
                message: MessageEnum.NOT_FOUND,
                data: null
            })
        });

        it('should return precondition failed error', async () => {
            const error = new Error('Some error')

            jest.spyOn(roleRepository, 'findOneBy').mockRejectedValue(error)

            const result = await roleService.getRoleByValue(role.value);

            expect(roleRepository.findOneBy).toHaveBeenCalledWith({ value: role.value })
            expect(result).toEqual<ResponseRoleDto<IRole>>({
                status: HttpStatus.PRECONDITION_FAILED,
                message: MessageEnum.PRECONDITION_FAILED,
                data: null,
                errors: error
            })
        });
    })

    describe('getRoles', () => {
        it('should return roles with OK status', async () => {

            jest.spyOn(roleRepository, 'find').mockResolvedValue([role])

            const result = await roleService.getRoles();

            expect(roleRepository.find).toHaveBeenCalled();
            expect(result).toEqual<ResponseRoleDto<IRole>>({
                status: HttpStatus.OK,
                message: MessageEnum.ROLE_SEARCH_OK,
                data: result.data
            })
        });


        it('should return precondition failed error', async () => {
            const error = new Error('Some error')

            jest.spyOn(roleRepository, 'find').mockRejectedValue(error)

            const result = await roleService.getRoles();

            expect(roleRepository.find).toHaveBeenCalled();
            expect(result).toEqual<ResponseRoleDto<IRole>>({
                status: HttpStatus.PRECONDITION_FAILED,
                message: MessageEnum.PRECONDITION_FAILED,
                data: null,
                errors: error
            })
        });
    })
})
