import {LoginDto} from "@/app/interfaces/auth/request-dto/login.dto";

export interface RegistrationDto extends LoginDto {
    userName: string;
    fullName: string;
}
