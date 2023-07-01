import {LoginDto} from "@/app/interfaces/auth/request-dto/login.dto";

export class CreateUserDto extends LoginDto {
    userName: string;
    fullName: string;
}
