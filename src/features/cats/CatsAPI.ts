import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CatDetails, Cat, JWT } from "../../app/types";

export const catApi = createApi({
    reducerPath: 'catApi',
    tagTypes: ['Cats'],
    baseQuery: fetchBaseQuery({ 
        baseUrl: `${import.meta.env.VITE_BASE_API}/`,
        prepareHeaders: (headers) => {
            const jwtString = localStorage.getItem("jwt");

            if (jwtString) {
                try {
                  const tokenObj: JWT = JSON.parse(jwtString);
                  const accessToken = tokenObj?.access_token;
            
                  if (accessToken) {
                    headers.set("Authorization", `Bearer ${accessToken}`);
                  }
                } catch (error) {
                  console.error("Failed to parse JWT from localStorage:", error);
                }
              }
            
              return headers;
          },
    }),
    endpoints: (builder) => ({
        createCat: builder.mutation<Cat, CatDetails>({
          query: (newCat) => ({
            url: 'cats',
            method: 'POST',
            body: newCat,
          }),
          invalidatesTags: (result, error, { ownerId }) => [{ type: 'Cats' as const, id: String(ownerId) }],
        }),
      
        getCatsForUser: builder.query<Cat[], string>({
          query: (userId) => `cats?ownerId=${userId}`,
          providesTags: (result, error, userId) => [{ type: 'Cats' as const, id: String(userId) }],
        }),

        getCatById: builder.query<Cat, { catId: string; ownerId: number}>({
          query: ({catId, ownerId}) => `cats/${catId}`,
          providesTags: (result, error, { catId, ownerId }) => [{ type: 'Cats' as const, id: String(ownerId) }],
        }),

        updateCat: builder.mutation<Cat, { catId: string; details: CatDetails}>({
          query: ({catId, details}) => ({
            url: `cats/${catId}`,
            method: 'PATCH',
            body: details,
          }),
          invalidatesTags: (result, error, { catId, details }) => [{ type: 'Cats' as const, id: String(details.ownerId) }],
        }),

        deleteCat: builder.mutation<void, { catId: number; ownerId: number}>({
          query: ({catId, ownerId}) => ({
            url: `cats/${catId}`,
            method: 'DELETE',
          }),
          invalidatesTags: (result, error, { catId, ownerId }) => [{ type: 'Cats' as const, id: String(ownerId) }],
        }),
      }),
});

export const { useCreateCatMutation, useGetCatByIdQuery, useGetCatsForUserQuery, useUpdateCatMutation, useDeleteCatMutation } = catApi;