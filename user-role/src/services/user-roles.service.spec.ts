import {UserRolesService} from "./user-roles.service";
import {Repository} from "typeorm";
import {IUserRole} from "../interfaces/IUserRole";
import {Test, TestingModule} from "@nestjs/testing";
import {getRepositoryToken} from "@nestjs/typeorm";
import {UserRoleEntity} from "../repository/user-role.entity";
import {AssignRoleToUserDto} from "../interfaces/request-dtos/create-user.dto";
import {HttpStatus} from "@nestjs/common";
import {UserRoleResponseDto} from "../interfaces/response-dtos/user-response.dto";
import {MessageEnum} from "../interfaces/message-enums/message.enum";

describe('UserRole service test', () => {
    let userRoleService: UserRolesService
    let userRoleRepository: Repository<IUserRole>

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
                UserRolesService,
                {
                    provide: getRepositoryToken(UserRoleEntity),
                    useClass: Repository
                }
            ]
        }).compile();

        userRoleService = module.get<UserRolesService>(UserRolesService);
        userRoleRepository = module.get<UserRoleEntity>(UserRoleEntity);
    })

    describe('assignRoleToUser', () => {
        it('should assign role to user with status OK', async () => {
            jest.spyOn(userRoleRepository, 'create').mockReturnValue(userRole);

            const result = await userRoleService.assignRoleToUser(userRoleDto)

            expect(userRoleRepository.create).toHaveBeenCalledWith(userRoleDto)
            expect(result).toEqual<UserRoleResponseDto<IUserRole>>({
                status: HttpStatus.CREATED,
                message: MessageEnum.CREATED,
                data: result.data
            })
        });
        it('should return precondition failed error', async () => {
            const error = new Error('Some error')
            jest.spyOn(userRoleRepository, 'create').mockRejectedValue(error as never)

            const result = await userRoleService.assignRoleToUser(userRoleDto)

            expect(userRoleRepository.create).toHaveBeenCalledWith(userRoleDto)
            expect(result).toEqual<UserRoleResponseDto<IUserRole>>({
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

            const result = await userRoleService.getRoleForUser(userId)

            expect(userRoleRepository.findBy).toHaveBeenCalledWith({ userId })
            expect(result).toEqual<UserRoleResponseDto<IUserRole[]>>({
                status: HttpStatus.OK,
                message: MessageEnum.OK,
                data: result.data
            })
        });
        it('should return not found status if relation doesnt exist', async () => {

            jest.spyOn(userRoleRepository, 'findBy').mockResolvedValue(null);

            const result = await userRoleService.getRoleForUser(userId)

            expect(userRoleRepository.findBy).toHaveBeenCalledWith({ userId })
            expect(result).toEqual<UserRoleResponseDto<IUserRole[]>>({
                status: HttpStatus.NOT_FOUND,
                message: MessageEnum.NOT_FOUND,
                data: null
            })
        });
        it('should return precondition failed error', async () => {
            const error = new Error('Some error');

            jest.spyOn(userRoleRepository, 'findBy').mockRejectedValue(error);

            const result = await userRoleService.getRoleForUser(userId)

            expect(userRoleRepository.findBy).toHaveBeenCalledWith({ userId })
            expect(result).toEqual<UserRoleResponseDto<IUserRole[]>>({
                status: HttpStatus.PRECONDITION_FAILED,
                message: MessageEnum.PRECONDITION_FAILED,
                data: null,
                errors: error
            })
        });

    })
})
