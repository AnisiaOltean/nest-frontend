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
          invalidatesTags: (result, error, args) => [{ type: 'Cats' as const }],
        }),
      
        getCatsForUser: builder.query<Cat[], void>({
          query: () => `cats`,
          providesTags: (result, error, args) => 
            result
          ? [...result.map(({ id }) => ({ type: 'Cats' as const, id: String(id) })), 'Cats']
          : ['Cats'],
        }),

        getCatById: builder.query<Cat, { catId: string; }>({
          query: ({catId}) => `cats/${catId}`,
          providesTags: (result, error, { catId }) => [{ type: 'Cats' as const, id: String(catId) }],
        }),

        updateCat: builder.mutation<Cat, { catId: string; details: CatDetails}>({
          query: ({catId, details}) => ({
            url: `cats/${catId}`,
            method: 'PATCH',
            body: details,
          }),
          invalidatesTags: (result, error, { catId }) => [{ type: 'Cats', id: String(catId) }],
        }),

        deleteCat: builder.mutation<void, { catId: number }>({
          query: ({catId }) => ({
            url: `cats/${catId}`,
            method: 'DELETE',
          }),
          invalidatesTags: (result, error, { catId }) => [{ type: 'Cats', id: String(catId) }],
        }),
      }),
});

export const { useCreateCatMutation, useGetCatByIdQuery, useGetCatsForUserQuery, useUpdateCatMutation, useDeleteCatMutation } = catApi;