import {SubscriptionService} from "./subscription.service";
import {Repository} from "typeorm";
import {ISubscription} from "../interfaces/ISubscription";
import {Test, TestingModule} from "@nestjs/testing";
import {getRepositoryToken} from "@nestjs/typeorm";
import {SubscriptionEntity} from "../repository/subscription.entity";
import {HttpStatus, Logger} from "@nestjs/common";
import {MessageEnum} from "../interfaces/message-enums/message.enum";
import {AssignSubscriptionDto} from "../interfaces/request-dtos/assign-subscription.dto";
import {IUserSubscription} from "../interfaces/IUserSubscription";
import {UserSubscriptionEntity} from "../repository/user-subscription.entity";
import {ResponseDto} from "../interfaces/response-dtos/subscription.dto";
import {CreateSubscriptionDto} from "../interfaces/request-dtos/create-subscription.dto";

describe('UserRole service test', () => {
    let subscriptionService: SubscriptionService
    let subscriptionRepository: Repository<ISubscription>
    let userSubscriptionRepository: Repository<IUserSubscription>
    let logger: Logger;

    const subscription: ISubscription = {
        id: '2',
        value: 'premium',
        description: 'This is subscription for premium users',
        yearPrice: '300',
        monthPrice: '30'
    }


    const subscriptionDto: CreateSubscriptionDto = {
        value: 'premium',
        description: 'This is subscription for premium users',
        yearPrice: '300',
        monthPrice: '30'

    }

    const userSubscription: IUserSubscription = {
        id: '1',
        userId: '12',
        subscriptionId: '1'
    }


    const userSubscriptionDto: AssignSubscriptionDto = {
        userId: '12',
        subscriptionId: '1'
    }



    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SubscriptionService,
                {
                    provide: getRepositoryToken(SubscriptionEntity),
                    useClass: Repository
                },
                {
                    provide: getRepositoryToken(UserSubscriptionEntity),
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

        subscriptionService = module.get<SubscriptionService>(SubscriptionService);
        subscriptionRepository = module.get<SubscriptionEntity>(SubscriptionEntity);
        userSubscriptionRepository = module.get<UserSubscriptionEntity>(UserSubscriptionEntity);
        logger = module.get<Logger>(Logger);
    })

    describe('createRole', () => {
        it('should return role with status OK when role hasn\'t been created yet', async () => {
            jest.spyOn(subscriptionRepository, 'findOneBy').mockResolvedValue(null);
            jest.spyOn(subscriptionRepository, 'create').mockReturnValue(subscription);
            jest.spyOn(subscriptionRepository, 'save').mockResolvedValue(subscription);

            const result = await subscriptionService.createSubscription(subscriptionDto);

            expect(subscriptionRepository.findOneBy).toHaveBeenCalledWith({ value: subscriptionDto.value });
            expect(subscriptionRepository.create).toHaveBeenCalledWith(subscriptionDto);
            expect(subscriptionRepository.save).toHaveBeenCalledWith(subscription);
            expect(result).toEqual<ResponseDto<ISubscription>>({
                status: HttpStatus.CREATED,
                message: MessageEnum.CREATED,
                data: result.data,
            });
        });

        it('should return conflict error when role already created', async () => {
            jest.spyOn(subscriptionRepository, 'findOneBy').mockResolvedValue(subscription);

            const result = await subscriptionService.createSubscription(subscriptionDto)

            expect(subscriptionRepository.findOneBy).toHaveBeenCalledWith({ value: subscriptionDto.value })
            expect(result).toEqual<ResponseDto<null>>({
                status: HttpStatus.CONFLICT,
                message: MessageEnum.CONFLICT,
                data: null
            })
        });

        it('should return precondition failed error', async () => {
            const error = new Error('Some error');
            jest.spyOn(subscriptionRepository, 'findOneBy').mockRejectedValue(error)

            const result = await subscriptionService.createSubscription(subscriptionDto);

            expect(subscriptionRepository.findOneBy).toHaveBeenCalledWith({ value: subscriptionDto.value })
            expect(result).toEqual<ResponseDto<null>>({
                status: HttpStatus.PRECONDITION_FAILED,
                message: MessageEnum.PRECONDITION_FAILED,
                data: null,
                errors: error
            })
        });
    })

    describe('getRoleByValue', () => {
        it('should return role with status OK when role exist', async () => {

            jest.spyOn(subscriptionRepository, 'findOneBy').mockResolvedValue(subscription);

            const result = await subscriptionService.getSubscriptionByValue(subscription.value);

            expect(subscriptionRepository.findOneBy).toHaveBeenCalledWith({ value: subscription.value })
            expect(result).toEqual<ResponseDto<ISubscription>>({
                status: HttpStatus.OK,
                message: MessageEnum.SUBSCRIPTION_SEARCH_OK,
                data: result.data
            })
        });

        it('should return not found when role not exist', async () => {
            jest.spyOn(subscriptionRepository, 'findOneBy').mockResolvedValue(null);

            const result = await subscriptionService.getSubscriptionByValue(subscription.value);

            expect(subscriptionRepository.findOneBy).toHaveBeenCalledWith({ value: subscription.value })
            expect(result).toEqual<ResponseDto<ISubscription>>({
                status: HttpStatus.NOT_FOUND,
                message: MessageEnum.SUBSCRIPTION_NOT_FOUND,
                data: null
            })
        });

        it('should return precondition failed error', async () => {
            const error = new Error('Some error')

            jest.spyOn(subscriptionRepository, 'findOneBy').mockRejectedValue(error)

            const result = await subscriptionService.getSubscriptionByValue(subscription.value);

            expect(subscriptionRepository.findOneBy).toHaveBeenCalledWith({ value: subscription.value })
            expect(result).toEqual<ResponseDto<ISubscription>>({
                status: HttpStatus.PRECONDITION_FAILED,
                message: MessageEnum.PRECONDITION_FAILED,
                data: null,
                errors: error
            })
        });
    })

    describe('getRoles', () => {
        it('should return role with OK status', async () => {

            jest.spyOn(subscriptionRepository, 'find').mockResolvedValue([subscription])

            const result = await subscriptionService.getSubscriptions();

            expect(subscriptionRepository.find).toHaveBeenCalled();
            expect(result).toEqual<ResponseDto<ISubscription[]>>({
                status: HttpStatus.OK,
                message: MessageEnum.SUBSCRIPTION_SEARCH_OK,
                data: result.data
            })
        });


        it('should return precondition failed error', async () => {
            const error = new Error('Some error')

            jest.spyOn(subscriptionRepository, 'find').mockRejectedValue(error)

            const result = await subscriptionService.getSubscriptions();

            expect(subscriptionRepository.find).toHaveBeenCalled();
            expect(result).toEqual<ResponseDto<ISubscription[]>>({
                status: HttpStatus.PRECONDITION_FAILED,
                message: MessageEnum.PRECONDITION_FAILED,
                data: null,
                errors: error
            })
        });
    })


    describe('assignRoleToUser', () => {
        it('should assign role to user with status OK', async () => {

            jest.spyOn(userSubscriptionRepository, 'create').mockReturnValue(userSubscription);
            jest.spyOn(userSubscriptionRepository, 'save').mockResolvedValue(userSubscription);

            const result = await subscriptionService.assignSubscriptionToUser(userSubscriptionDto)

            expect(userSubscriptionRepository.create).toHaveBeenCalledWith(userSubscriptionDto)
            expect(result).toEqual<ResponseDto<IUserSubscription>>({
                status: HttpStatus.CREATED,
                message: MessageEnum.CREATED,
                data: result.data
            })
           // expect(logger.log).toHaveBeenCalledWith(SubscriptionLogsEnum.SUBSCRIPTION_ASSIGNMENT_SUCCESS);
        });
        it('should return precondition failed error', async () => {
            const error = new Error('Some error')
            jest.spyOn(userSubscriptionRepository, 'create').mockRejectedValue(error as never)

            const result = await subscriptionService.assignSubscriptionToUser(userSubscriptionDto)

            expect(userSubscriptionRepository.create).toHaveBeenCalledWith(userSubscriptionDto)
            expect(result).toEqual<ResponseDto<IUserSubscription>>({
                status: HttpStatus.PRECONDITION_FAILED,
                message: MessageEnum.PRECONDITION_FAILED,
                data: null,
                errors: error
            })
           // expect(logger.error).toHaveBeenCalledWith(SubscriptionLogsEnum.SUBSCRIPTION_ASSIGNMENT_ERROR, error);

        });
    })

    describe('getSubscriptionForUser', () => {
        const userId = '2'
        it('should return a roles for current user', async () => {
            jest.spyOn(userSubscriptionRepository, 'findBy').mockResolvedValue([userSubscription]);

            const result = await subscriptionService.getSubscriptionsForUser(userId)

            expect(userSubscriptionRepository.findBy).toHaveBeenCalledWith({ userId })
            expect(result).toEqual<ResponseDto<IUserSubscription[]>>({
                status: HttpStatus.OK,
                message: MessageEnum.RELATION_SEARCH_OK,
                data: result.data
            })
          //  expect(logger.error).toHaveBeenCalledWith(SubscriptionLogsEnum.SUBSCRIPTION_RETRIEVAL_SUCCESS);

        });
        it('should return not found status if relation doesnt exist', async () => {

            jest.spyOn(userSubscriptionRepository, 'findBy').mockResolvedValue(null);

            const result = await subscriptionService.getSubscriptionsForUser(userId)

            expect(userSubscriptionRepository.findBy).toHaveBeenCalledWith({ userId })
            expect(result).toEqual<ResponseDto<IUserSubscription[]>>({
                status: HttpStatus.NOT_FOUND,
                message: MessageEnum.RELATION_NOT_FOUND,
                data: null
            })
           // expect(logger.warn).toHaveBeenCalledWith(SubscriptionLogsEnum.SUBSCRIPTION_RETRIEVAL_NOT_FOUND);
        });
        it('should return precondition failed error', async () => {
            const error = new Error('Some error');

            jest.spyOn(userSubscriptionRepository, 'findBy').mockRejectedValue(error);

            const result = await subscriptionService.getSubscriptionsForUser(userId)

            expect(userSubscriptionRepository.findBy).toHaveBeenCalledWith({ userId })
            expect(result).toEqual<ResponseDto<IUserSubscription[]>>({
                status: HttpStatus.PRECONDITION_FAILED,
                message: MessageEnum.PRECONDITION_FAILED,
                data: null,
                errors: error
            })
           // expect(logger.error).toHaveBeenCalledWith(SubscriptionLogsEnum.SUBSCRIPTION_RETRIEVAL_ERROR, error);

        });

    })
})
