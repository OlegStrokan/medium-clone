import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export const BASE_URL = 'http://localhost:8000/'

const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
  });

export const api = createApi({
    baseQuery: baseQuery,
    endpoints: () => ({}),
});

