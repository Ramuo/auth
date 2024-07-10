import {apiSlice} from "./apiSlice";
import { USERS_URL } from "../constants";
import { logout } from "./authSlice";



const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/login`,
                method: 'POST',
                body: data
            }),
        }),
        register: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/register`,
                method: 'POST',
                body: data
            }),
        }),
        logout: builder.mutation({
            query: () => ({
                url: `${USERS_URL}/logout`,
                method: 'POST'
            }),
        }),
        verifyEmail: builder.query({
            query: (token) => ({
                url: `${USERS_URL}/verify/${token}`,
            }),
            keepUnusedDataFor: 5,
        }),
        resendVerifyEmail: builder.query({
            query: (token) => ({
                url: `${USERS_URL}/resend/verify/${token}`,
            }),
            keepUnusedDataFor: 5,
        }),
    }),
});


export const {
    useLoginMutation,
    useRegisterMutation,
    useLogoutMutation,
    useVerifyEmailQuery,
    useResendVerifyEmailQuery,
}= userApiSlice;