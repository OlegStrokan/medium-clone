import {CreateUserDto} from "@/app/interfaces/auth/request-dto/create-user.dto";
import {LoginDto} from "@/app/interfaces/auth/request-dto/login.dto";
import {LogoutDto} from "@/app/interfaces/auth/request-dto/logout.dto";
import {CreateUserResponseDto} from "@/app/interfaces/auth/response-dto/create-user.dto";
import {LoginResponseDto} from "@/app/interfaces/auth/response-dto/login.dto";
import {LogoutResponseDto} from "@/app/interfaces/auth/response-dto/logout.dto";


export const authApi = (builder) => {
    return builder
        .mutation<CreateUserResponseDto, CreateUserDto>({
            registration: {
                query: (dto: CreateUserDto) => ({
                    url: 'auth/registration',
                    method: 'POST',
                    body: dto
                }),
            }
        })
        .mutation<LoginResponseDto, LoginDto>({
            login: {
                query: (dto: LoginDto) => ({
                    url: 'auth/login',
                    method: 'POST',
                    body: dto
                }),
            }
        })
        .mutation<LogoutResponseDto, LogoutDto>({
            logout: {
                query: (dto: LogoutDto) => ({
                    url: 'auth/logout',
                    method: 'POST',
                    body: dto
                }),
            }
        });
};
