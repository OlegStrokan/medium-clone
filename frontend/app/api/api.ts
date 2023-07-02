import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {LoginResponseDto} from "@/app/interfaces/auth/response-dto/login.dto";
import {LoginDto} from "@/app/interfaces/auth/request-dto/login.dto";
import {LogoutResponseDto} from "@/app/interfaces/auth/response-dto/logout.dto";
import {LogoutDto} from "@/app/interfaces/auth/request-dto/logout.dto";
import {RegistrationResponseDto} from "@/app/interfaces/auth/response-dto/registration";
import {RegistrationDto} from "@/app/interfaces/auth/request-dto/registration";



const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
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
                body: dto
            }),
        }),
    }),
});

export const { useLoginMutation, useRegisterMutation, useLogoutMutation } = authApi
