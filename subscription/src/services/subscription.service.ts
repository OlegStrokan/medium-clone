import {HttpStatus, Injectable, Logger} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {SubscriptionEntity} from "../repository/subscription.entity";
import {Repository} from "typeorm";
import {ISubscription} from "../interfaces/ISubscription";
import {MessageEnum} from "../interfaces/message-enums/message.enum";
import {SubscriptionLogsEnum} from "../interfaces/message-enums/subscription-logs.enum";
import {ResponseDto} from "../interfaces/response-dtos/subscription.dto";
import {AssignSubscriptionDto} from "../interfaces/request-dtos/assign-subscription.dto";
import {CreateSubscriptionDto} from "../interfaces/request-dtos/create-subscription.dto";
import {UserSubscriptionEntity} from "../repository/user-subscription.entity";
import {IUserSubscription} from "../interfaces/IUserSubscription";

@Injectable()
export class SubscriptionService {
    private readonly logger: Logger

    constructor(
        @InjectRepository(SubscriptionEntity)
        private readonly subscriptionRepository: Repository<ISubscription>,
        @InjectRepository(UserSubscriptionEntity)
        private readonly userSubscriptionRepository: Repository<IUserSubscription>
    ) {
        this.logger = new Logger(SubscriptionService.name)
    }


    public async createSubscription(dto: CreateSubscriptionDto): Promise<ResponseDto<ISubscription>> {

        this.logger.log(SubscriptionLogsEnum.CREATE_SUBSCRIPTION_INITIATED)
        try {
            const role = await this.subscriptionRepository.findOneBy({value: dto.value})
            if (role) {
                this.logger.warn(SubscriptionLogsEnum.CREATE_SUBSCRIPTION_CONFLICT)
                return {
                    status: HttpStatus.CONFLICT,
                    message: MessageEnum.SUBSCRIPTION_CONFLICT,
                    data: null
                }
            }
            const newRole = await this.subscriptionRepository.create(dto)
            await this.subscriptionRepository.save(newRole);

            const response = await this.subscriptionRepository.findOneBy({value: dto.value})

            this.logger.log(SubscriptionLogsEnum.CREATE_SUBSCRIPTION_SUCCESS)
            return {
                status: HttpStatus.CREATED,
                message: MessageEnum.CREATED,
                data: response
            }
        } catch (e) {
            this.logger.error(SubscriptionLogsEnum.CREATE_SUBSCRIPTION_ERROR)
            return {
                status: HttpStatus.PRECONDITION_FAILED,
                message: MessageEnum.PRECONDITION_FAILED,
                data: null,
                errors: e
            }
        }
    }

    public async getSubscriptionById(id: string): Promise<ResponseDto<ISubscription>> {

        this.logger.log(SubscriptionLogsEnum.SUBSCRIPTION_SEARCH_INITIATED)
        try {
            const subscription = await this.subscriptionRepository.findOneBy({id});

            if (!subscription) {
                this.logger.log(SubscriptionLogsEnum.SUBSCRIPTION_NOT_FOUND)
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: MessageEnum.SUBSCRIPTION_NOT_FOUND,
                    data: subscription
                }
            }
            this.logger.log(SubscriptionLogsEnum.SUBSCRIPTION_SEARCH_OK)
            return {
                status: HttpStatus.OK,
                message: MessageEnum.SUBSCRIPTION_SEARCH_OK,
                data: subscription
            }
        } catch (e) {
            this.logger.error(SubscriptionLogsEnum.SUBSCRIPTION_SEARCH_ERROR)
            return {
                status: HttpStatus.PRECONDITION_FAILED,
                message: MessageEnum.PRECONDITION_FAILED,
                data: null,
                errors: e
            }
        }
    }

    public async getSubscriptions(): Promise<ResponseDto<ISubscription[]>> {

        this.logger.log(SubscriptionLogsEnum.SUBSCRIPTIONS_SEARCH_INITIATED)
        try {
            const roles = await this.subscriptionRepository.find();

            this.logger.log(SubscriptionLogsEnum.SUBSCRIPTIONS_SEARCH_OK)
            return {
                status: HttpStatus.OK,
                message: MessageEnum.SUBSCRIPTION_SEARCH_OK,
                data: roles
            }
        } catch (e) {
            this.logger.error(SubscriptionLogsEnum.SUBSCRIPTIONS_SEARCH_ERROR)
            return {
                status: HttpStatus.PRECONDITION_FAILED,
                message: MessageEnum.PRECONDITION_FAILED,
                data: null,
                errors: e
            }
        }
    }

    public async assignSubscriptionToUser(dto: AssignSubscriptionDto): Promise<ResponseDto<ISubscription[]>> {
        try {

            this.logger.log(SubscriptionLogsEnum.SUBSCRIPTION_ASSIGNMENT_INITIATED)

            if (dto.userId !== dto.subscribingUserId) {

                this.logger.log(SubscriptionLogsEnum.SUBSCRIPTION_CREATE_NOT_ALLOWED);
                return {
                    status: HttpStatus.FORBIDDEN,
                    message: MessageEnum.RELATION_FORBIDDEN,
                    data: null,
                }
            }

            const subscription = await this.getSubscriptionById(dto.subscriptionId);

            if  (!subscription) {
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: MessageEnum.SUBSCRIPTION_NOT_FOUND,
                    data: null
                }
            }

            const relation = await this.userSubscriptionRepository.findBy({
                userId: dto.userId,
                subscriptionId: dto.subscriptionId
            })

            if (relation.length > 0) {
                return {
                    status: HttpStatus.CONFLICT,
                    message: MessageEnum.RELATION_CONFLICT,
                    data: null
                }
            }
            const newRelation = await this.userSubscriptionRepository.create(dto)

            await this.userSubscriptionRepository.save(newRelation);

            const subscriptions = await this.getSubscriptionsForUser(dto.userId);

            this.logger.log(SubscriptionLogsEnum.SUBSCRIPTION_ASSIGNMENT_SUCCESS)
            return {
                status: HttpStatus.CREATED,
                message: MessageEnum.RELATION_CREATED,
                data: subscriptions.data
            }
        } catch (e) {
            this.logger.error(SubscriptionLogsEnum.SUBSCRIPTION_ASSIGNMENT_ERROR)
            return {
                status: HttpStatus.PRECONDITION_FAILED,
                message: MessageEnum.PRECONDITION_FAILED,
                data: null,
                errors: e
            }
        }

    }


    public async deleteSubscriptionFromUser(dto: AssignSubscriptionDto): Promise<ResponseDto<ISubscription[]>> {
        try {

            this.logger.log(SubscriptionLogsEnum.SUBSCRIPTION_DELETE_INITIATED)


            if (dto.userId !== dto.subscribingUserId) {

                this.logger.log(SubscriptionLogsEnum.SUBSCRIPTION_CREATE_NOT_ALLOWED);
                return {
                    status: HttpStatus.FORBIDDEN,
                    message: MessageEnum.DELETE_FORBIDDEN,
                    data: null,
                }
            }

            const relation = await this.userSubscriptionRepository.findOneBy({
                subscriptionId: dto.subscriptionId,
                userId: dto.userId
            })


            if (!relation) {
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: MessageEnum.RELATION_NOT_FOUND,
                    data: null
                }
            }


            await this.userSubscriptionRepository.delete({
                userId: dto.userId,
                subscriptionId: dto.subscriptionId
            })

            this.logger.log(SubscriptionLogsEnum.SUBSCRIPTION_DELETE_SUCCESS)

            const subscriptions = await this.getSubscriptionsForUser(dto.userId);

            return {
                status: HttpStatus.NO_CONTENT,
                message: MessageEnum.SUBSCRIPTION_DELETE_OK,
                data: subscriptions.data
            }
        } catch (e) {
            this.logger.error(SubscriptionLogsEnum.SUBSCRIPTION_DELETE_ERROR)
            return {
                status: HttpStatus.PRECONDITION_FAILED,
                message: MessageEnum.PRECONDITION_FAILED,
                data: null,
                errors: e
            }
        }
    }

    public async getSubscriptionsForUser(userId: string): Promise<ResponseDto<ISubscription[]>> {

        this.logger.log(SubscriptionLogsEnum.SUBSCRIPTION_RETRIEVAL_INITIATED)

        try {

            const relations = await this.userSubscriptionRepository.findBy({userId: userId})

            const subscriptionPromises = relations.map(async (relation) => {
                return await this.getById(relation.subscriptionId);
            });

            const subscriptions = await Promise.all(subscriptionPromises);


            if (!relations) {
                this.logger.warn(SubscriptionLogsEnum.SUBSCRIPTION_RETRIEVAL_NOT_FOUND)
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: MessageEnum.RELATION_NOT_FOUND,
                    data: null
                }
            }

            this.logger.log(SubscriptionLogsEnum.SUBSCRIPTION_RETRIEVAL_SUCCESS)

            return {
                status: HttpStatus.OK,
                message: MessageEnum.RELATION_SEARCH_OK,
                data: subscriptions
            }
        } catch (e) {

            this.logger.error(SubscriptionLogsEnum.SUBSCRIPTION_RETRIEVAL_ERROR)

            return {
                status: HttpStatus.PRECONDITION_FAILED,
                message: MessageEnum.PRECONDITION_FAILED,
                data: null,
                errors: e
            }
        }
    }

    private async getById(subscriptionId: string) {
        return await this.subscriptionRepository.findOneBy({id: subscriptionId})
    }
}
