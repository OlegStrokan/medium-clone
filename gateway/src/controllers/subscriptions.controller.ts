import {Body, Controller, Delete, HttpStatus, Inject, Logger, Patch, Req, UseGuards} from "@nestjs/common";
import {ClientProxy} from "@nestjs/microservices";
import {AuthGuard} from "../helpers/auth.guard";
import {AssignSubscriptionDto} from "../interfaces/subscriptions/dto/assign-subscription.dto";
import {IGetItemResponse} from "../interfaces/IGetItemResponse";
import {GenericHttpException} from "../helpers/GenericHttpException";
import {IGetItemServiceResponse} from "../interfaces/IGetItemServiceResponse";
import {firstValueFrom} from "rxjs";
import {MessageUserEnum} from "../interfaces/user/message-user.enum";
import {IError} from "../interfaces/IError";
import {ISubscription} from "../interfaces/subscriptions/ISubscription";


@Controller('subscriptions')
export class SubscriptionsController {

    private readonly logger: Logger;

    constructor(
        @Inject('subscription_service') private readonly subscriptionServiceClient: ClientProxy,
    ) {
        this.logger = new Logger(SubscriptionsController.name)

    }


    @UseGuards(AuthGuard)
    @Patch('/')
    public async subscribeUser(@Body() dto: AssignSubscriptionDto, @Req() request): Promise<IGetItemResponse<ISubscription[]> | GenericHttpException> {

        const subscriptionResponse: IGetItemServiceResponse<ISubscription[]> = await firstValueFrom(
            this.subscriptionServiceClient.send(
                MessageUserEnum.SUBSCRIPTION_ASSIGN_TO_USER, JSON.stringify({
                    ...dto,
                    userId: +dto.userId,
                    subscribingUserId: request.user
                }))
        )

        if (subscriptionResponse.status !== HttpStatus.CREATED) {
            throw new GenericHttpException<IError>(subscriptionResponse.status, subscriptionResponse.message)
        }

        return {
            data: subscriptionResponse.data,
            status: subscriptionResponse.status
        }


    }

    @UseGuards(AuthGuard)
    @Delete('/')
    public async unsubscribeUser(@Body() dto: AssignSubscriptionDto, @Req() request): Promise<IGetItemResponse<ISubscription[]> | GenericHttpException> {

        const subscriptionResponse: IGetItemServiceResponse<ISubscription[]> = await firstValueFrom(
            this.subscriptionServiceClient.send(
                MessageUserEnum.SUBSCRIPTION_DELETE_FROM_USER, JSON.stringify({
                    ...dto,
                    userId: +dto.userId,
                    subscribingUserId: request.user
                }))
        )

        if (subscriptionResponse.status !== HttpStatus.NO_CONTENT) {
            throw new GenericHttpException<IError>(subscriptionResponse.status, subscriptionResponse.message)
        }

        return {
            data: subscriptionResponse.data,
            status: subscriptionResponse.status
        }

    }

}
