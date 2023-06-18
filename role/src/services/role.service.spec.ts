import {RoleService} from "./role.service";
import {Repository} from "typeorm";
import {IRole} from "../interfaces/IRole";
import {Test, TestingModule} from "@nestjs/testing";
import {getRepositoryToken} from "@nestjs/typeorm";
import {RoleEntity} from "../repository/role.entity";
import {HttpStatus, Logger} from "@nestjs/common";
import {MessageEnum} from "../interfaces/message-enums/message-enum";
import {ResponseRoleDto} from "../interfaces/response-dtos.ts/response-role.dto";
import {UserRoleEntity} from "../repository/user-role.entity";
import {IUserRole} from "../interfaces/IUserRole";
import {AssignRoleToUserDto} from "../interfaces/request-dtos.ts/assign-role.dto";
import {RoleLogsEnum} from "../interfaces/message-enums/role-logs.enum";

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

    let userRoleRepository: Repository<IUserRole>
    let logger: Logger;

    const userRole: IUserRole = {
        id: '2',
        userId: '12',
        roleId: '1'
    }

    const userRoleDto: AssignRoleToUserDto = {
        userId: '12',
        roleId: '1'
    }



    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RoleService,
                {
                    provide: getRepositoryToken(RoleEntity),
                    useClass: Repository
                },
                {
                    provide: getRepositoryToken(UserRoleEntity),
                    useClass: Repository
                },
                {
                    provide: Logger,
                    useValue: {
                        log: jest.fn(),
                        error: jest.fn(),
                        warn: jest.fn(),
                        debug: jest.fn(),
                        verbose: jest.fn(),
                    },
                },
            ]
        }).compile();

        roleService = module.get<RoleService>(RoleService);
        roleRepository = module.get<RoleEntity>(RoleEntity);
        userRoleRepository = module.get<UserRoleEntity>(UserRoleEntity);
        logger = module.get<Logger>(Logger);
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
            expect(result).toEqual<ResponseRoleDto<IRole>>({
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
            expect(result).toEqual<ResponseRoleDto<null>>({
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
                message: MessageEnum.ROLE_NOT_FOUND,
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
        it('should return role with OK status', async () => {

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

    describe('getRoleForUser', () => {
        const userId = '2'
        it('should return a roles for current user', async () => {
            jest.spyOn(userRoleRepository, 'findBy').mockResolvedValue([userRole]);

            const result = await roleService.getRoleForUser(userId)

            expect(userRoleRepository.findBy).toHaveBeenCalledWith({ userId })
            expect(result).toEqual<ResponseRoleDto<IUserRole[]>>({
                status: HttpStatus.OK,
                message: MessageEnum.ROLE_SEARCH_OK,
                data: result.data
            })
           // expect(logger.error).toHaveBeenCalledWith(RoleLogsEnum.ROLE_RETRIEVAL_SUCCESS);

        });
        it('should return not found status if relation doesnt exist', async () => {

            jest.spyOn(userRoleRepository, 'findBy').mockResolvedValue(null);

            const result = await roleService.getRoleForUser(userId)

            expect(userRoleRepository.findBy).toHaveBeenCalledWith({ userId })
            expect(result).toEqual<ResponseRoleDto<IUserRole[]>>({
                status: HttpStatus.NOT_FOUND,
                message: MessageEnum.RELATION_NOT_FOUND,
                data: null
            })
          //  expect(logger.warn).toHaveBeenCalledWith(RoleLogsEnum.ROLE_RETRIEVAL_NOT_FOUND);
        });
        it('should return precondition failed error', async () => {
            const error = new Error('Some error');

            jest.spyOn(userRoleRepository, 'findBy').mockRejectedValue(error);

            const result = await roleService.getRoleForUser(userId)

            expect(userRoleRepository.findBy).toHaveBeenCalledWith({ userId })
            expect(result).toEqual<ResponseRoleDto<IUserRole[]>>({
                status: HttpStatus.PRECONDITION_FAILED,
                message: MessageEnum.PRECONDITION_FAILED,
                data: null,
                errors: error
            })
          //  expect(logger.error).toHaveBeenCalledWith(RoleLogsEnum.ROLE_RETRIEVAL_ERROR, error);

        });

    })
})
