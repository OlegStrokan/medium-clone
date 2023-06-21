import {Controller, Inject} from "@nestjs/common";
import {ClientProxy} from "@nestjs/microservices";


@Controller('subscriptions')
export class SubscriptionsController {
    constructor(
        @Inject('') private readonly a: ClientProxy
    ) {
    }


     async hello() {

     }
}
