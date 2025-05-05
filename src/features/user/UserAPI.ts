import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Cat } from "../../app/types";
import { RootState } from "../../app/store";

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({ 
        baseUrl: `${import.meta.env.VITE_BASE_API}/`,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.jwt;
      
            if (token) {
              headers.set('Authorization', `Bearer ${token}`);
            }
      
            return headers;
          },
    }),
    endpoints: (builder) => ({
      getCatsForUser: builder.query<Cat[], string>({
        query: (userId) => `users/${userId}/cats`,
      }),
    }),
});

export const { useGetCatsForUserQuery } = userApi;

