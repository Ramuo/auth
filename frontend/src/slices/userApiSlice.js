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
        google: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/google`,
                method: 'POST',
                body: data
            }), 
        }),
        facebook: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/facebook`,
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
        forgotpassword: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/forgot-password`,
                method: 'POST',
                body: data
            }),
        }),
        resetpassword: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/reset-password/${data.token}`,
                method: 'PUT',
                body: data
            }),
            invalidatesTags: ['User'],
        }),
    }),
});


export const {
    useLoginMutation,
    useRegisterMutation,
    useLogoutMutation,
    useVerifyEmailQuery,
    useResendVerifyEmailQuery,
    useGoogleMutation,
    useFacebookMutation,
    useForgotpasswordMutation,
    useResetpasswordMutation
}= userApiSlice;