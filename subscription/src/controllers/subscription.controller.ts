import {Controller} from '@nestjs/common';
import {SubscriptionService} from '../services/subscription.service';
import {MessagePattern} from "@nestjs/microservices";
import {MessagePatternEnum} from "../interfaces/message-enums/message-pattern.enum";
import {ISubscription} from "../interfaces/ISubscription";
import {ResponseDto} from "../interfaces/response-dtos/subscription.dto";

@Controller()
export class SubscriptionController {
    constructor(private readonly subscriptionService: SubscriptionService) {
    }

    @MessagePattern(MessagePatternEnum.SUBSCRIPTION_CREATE)
    public async createSubscription(jsonDto: string): Promise<ResponseDto<ISubscription>> {
        return this.subscriptionService.createSubscription(JSON.parse(jsonDto))
    }

    @MessagePattern(MessagePatternEnum.SUBSCRIPTION_GET_BY_VALUE)
    public async getSubscriptionByValue(jsonDto: string): Promise<ResponseDto<ISubscription>> {
        return this.subscriptionService.getSubscriptionByValue(JSON.parse(jsonDto))
    }

    @MessagePattern(MessagePatternEnum.SUBSCRIPTION_GET_ALL)
    public async getSubscriptions(): Promise<ResponseDto<ISubscription[]>> {
        return this.subscriptionService.getSubscriptions()
    }

    @MessagePattern(MessagePatternEnum.SUBSCRIPTION_ASSIGN_TO_USER)
    public async assignSubscriptionToUser(jsonDto: string): Promise<ResponseDto<ISubscription[]>> {
        return this.subscriptionService.assignSubscriptionToUser(JSON.parse(jsonDto));
    }

    @MessagePattern(MessagePatternEnum.SUBSCRIPTION_DELETE_FROM_USER)
    public async deleteSubscriptionFromUser(jsonDto: string): Promise<ResponseDto<ISubscription[]>> {
        return this.subscriptionService.deleteSubscriptionFromUser(JSON.parse(jsonDto));
    }

    @MessagePattern(MessagePatternEnum.SUBSCRIPTION_GET_FOR_USER)
    public async getSubscriptionForUser(userId: string): Promise<ResponseDto<ISubscription[]>> {
         return this.subscriptionService.getSubscriptionsForUser(userId)
    }
}
