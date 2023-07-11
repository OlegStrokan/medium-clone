import { api } from '@/api/api'
import { LoginDto } from '@/interfaces/auth/request-dto/login.dto'
import { LogoutDto } from '@/interfaces/auth/request-dto/logout.dto'
import { RegistrationDto } from '@/interfaces/auth/request-dto/registration'
import { LoginResponseDto } from '@/interfaces/auth/response-dto/login.dto'
import { LogoutResponseDto } from '@/interfaces/auth/response-dto/logout.dto'
import { RegistrationResponseDto } from '@/interfaces/auth/response-dto/registration'

export const authApi = api.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<LoginResponseDto, LoginDto>({
            query: (dto) => ({
                url: 'auth/login',
                method: 'POST',
                body: dto,
            }),
        }),
        register: builder.mutation<RegistrationResponseDto, RegistrationDto>({
            query: (dto) => ({
                url: 'auth/register',
                method: 'POST',
                body: dto,
            }),
        }),
        logout: builder.mutation<LogoutResponseDto, LogoutDto>({
            query: (dto) => ({
                url: 'auth/logout',
                method: 'POST',
                body: dto,
            }),
        }),
    }),
})

export const { useLoginMutation, useLogoutMutation, useRegisterMutation } =
    authApi
