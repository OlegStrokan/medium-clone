import {IUser} from "../IUser";
import {ISubscription} from "../../subscriptions/ISubscription";
import {IRole} from "../../role/IRole";

export class GetUserDto {
    user: IUser
    subscriptions?: ISubscription[]
    roles?: IRole[]
}
