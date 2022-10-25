import {Controller, Inject} from '@nestjs/common';
import {UserService} from './services/user.service';
import {ClientProxy} from "@nestjs/microservices";
import {IUserCreateResponse} from "./interfaces/user-create-response.interface";
import {IUserCreate} from "./interfaces/user-create.interface";

@Controller()
export class UserController {
    constructor(
        private readonly userService: UserService,
        @Inject('MAILER_SERVICE') private readonly mailerServiceClient: ClientProxy
    ) {
    }

    public async registration(userParams: IUserCreate): Promise<IUserCreateResponse> {
        return this.userService.createUser(userParams);

    }

}
