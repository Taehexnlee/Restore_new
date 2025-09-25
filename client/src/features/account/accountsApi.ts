// src/features/accounts/accountsApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import type { User, Address } from '../../app/models/user'; // Include Address type definition
import type { LoginRequest, RegisterRequest } from '../../app/models/auth';
import { baseQueryWithErrorHandling } from '../../app/api/baseApi';

// Toast notifications and router helper
import { toast } from 'react-toastify';
import { router } from '../../app/routes/Routes';

export const accountsApi = createApi({
  reducerPath: 'accountsApi',
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ['UserInfo'],
  endpoints: (builder) => ({
    // Login using cookie-based authentication
    login: builder.mutation<void, LoginRequest>({
      query: (creds) => ({
        url: '/login?useCookies=true',  // Base URL already includes /api
        method: 'POST',
        body: creds,
        credentials: 'include',
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Refresh cached user information after a successful login
          dispatch(accountsApi.util.invalidateTags(['UserInfo']));
        } catch {
          /* noop */
        }
      },
    }),

    // Register via the AccountController
    register: builder.mutation<void, RegisterRequest>({
      query: (creds) => ({
        url: '/account/register',
        method: 'POST',
        body: creds,
        credentials: 'include',
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Registration successful. You can now sign in.');
          router.navigate('/login');
        } catch {
          toast.error('Registration failed. Please try again.');
        }
      },
    }),

    // Fetch details for the signed-in user
    userInfo: builder.query<User, void>({
      query: () => ({
        url: '/account/user-info',
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['UserInfo'],
    }),

    // Logout (server clears the authentication cookie)
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/account/logout',
        method: 'POST',
        credentials: 'include',
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Invalidate user cache and return to the home page
          dispatch(accountsApi.util.invalidateTags(['UserInfo']));
          router.navigate('/');
        } catch {
          /* noop */
        }
      },
    }),

    // Fetch the user's stored address
    fetchUserAddress: builder.query<Address, void>({
      query: () => ({
        url: '/account/address',
        method: 'GET',
        credentials: 'include',
      }),
    }),

    // Update the user's address with an optimistic cache update
    updateUserAddress: builder.mutation<Address, Address>({
      query: (address) => ({
        url: '/account/address',
        method: 'POST',
        body: address,
        credentials: 'include',
      }),
      async onQueryStarted(address, { dispatch, queryFulfilled }) {
        // Apply optimistic cache patch
        const patch = dispatch(
          accountsApi.util.updateQueryData('fetchUserAddress', undefined, (draft) => {
            Object.assign(draft as Address, address);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo(); // Roll back on failure
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useUserInfoQuery,
  useLogoutMutation,
  useLazyUserInfoQuery,      // Lazy variant for manual refresh after login
  useFetchUserAddressQuery,  // Hook for address retrieval
  useUpdateUserAddressMutation, // Hook for address updates
} = accountsApi;
