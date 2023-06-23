import {GetUserDto} from "../../user/response-dto/get-user.dto";

export class LoginReturnDto extends GetUserDto {
    token: string
}
