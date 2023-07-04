import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { LoginResponseDto } from "../interfaces/auth/response-dto/login.dto";
import { LoginDto } from "../interfaces/auth/request-dto/login.dto";
import { RegistrationResponseDto } from "../interfaces/auth/response-dto/registration";
import { RegistrationDto } from "../interfaces/auth/request-dto/registration";
import { LogoutDto } from "../interfaces/auth/request-dto/logout.dto";
import { LogoutResponseDto } from "../interfaces/auth/response-dto/logout.dto";


export const BASE_URL = 'http://localhost:8000/'

const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
  });

export const api = createApi({
    baseQuery: baseQuery,
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




export const { useLoginMutation, useRegisterMutation, useLogoutMutation } = api
