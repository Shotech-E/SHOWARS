import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {getBaseUrl} from "../../../utils/baseURL";

const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${getBaseUrl()}/api/auth`,
        credentials: "include",
    }),
    
    endpoints: (builder) => ({
        registerUser: builder.mutation({
            query: (newUser) => ({
                url: "/signup",
                method: "POST",
                body: newUser,
            }),
        }),
        loginUser: builder.mutation({
            query: (data) => ({
                url: "/login",
                method: "POST",
                body: data,
            }),
        })
    })
})

export const { useRegisterUserMutation, useLoginUserMutation } = authApi
export default authApi