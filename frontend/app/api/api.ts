import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {authApi} from "@/app/api/auth.api";

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
    endpoints: (builder) => {
       authApi(builder)
    },
})

