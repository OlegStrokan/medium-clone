import {HttpStatus} from "@nestjs/common";
import {ApiProperty} from "@nestjs/swagger";
import {ISubscription} from "../../subscriptions/ISubscription";

export class GetSubscriptionSwaggerDto {
    @ApiProperty({ example: HttpStatus.OK })
    status: HttpStatus
    @ApiProperty({ type: () => [ISubscription]} )
    data: ISubscription[];
}
