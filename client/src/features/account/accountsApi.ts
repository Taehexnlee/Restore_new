// src/features/accounts/accountsApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import type { User, Address } from '../../app/models/user'; // ⬅️ Address 타입 추가
import type { LoginRequest, RegisterRequest } from '../../app/models/auth';
import { baseQueryWithErrorHandling } from '../../app/api/baseApi';

// ⬇️ 강의 기준 유틸
import { toast } from 'react-toastify';
import { router } from '../../app/routes/Routes';

export const accountsApi = createApi({
  reducerPath: 'accountsApi',
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ['UserInfo'],
  endpoints: (builder) => ({
    // 로그인 (쿠키 기반)
    login: builder.mutation<void, LoginRequest>({
      query: (creds) => ({
        url: '/login?useCookies=true',  // ⬅️ '/api' 제거
        method: 'POST',
        body: creds,
        credentials: 'include',
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // ✅ 로그인 성공 후 userInfo 새로고침
          dispatch(accountsApi.util.invalidateTags(['UserInfo']));
        } catch {
          /* noop */
        }
      },
    }),

    // 회원가입 (커스텀 AccountController)
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

    // 현재 로그인 사용자 정보
    userInfo: builder.query<User, void>({
      query: () => ({
        url: '/account/user-info',
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['UserInfo'],
    }),

    // 로그아웃 (서버에서 인증 쿠키 삭제)
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/account/logout',
        method: 'POST',
        credentials: 'include',
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // ✅ userInfo 캐시 무효화 + 홈으로 리다이렉트
          dispatch(accountsApi.util.invalidateTags(['UserInfo']));
          router.navigate('/');
        } catch {
          /* noop */
        }
      },
    }),

    // ✅ 유저 주소 조회
    fetchUserAddress: builder.query<Address, void>({
      query: () => ({
        url: '/account/address',
        method: 'GET',
        credentials: 'include',
      }),
    }),

    // ✅ 유저 주소 업데이트 (낙관적 업데이트)
    updateUserAddress: builder.mutation<Address, Address>({
      query: (address) => ({
        url: '/account/address',
        method: 'POST',
        body: address,
        credentials: 'include',
      }),
      async onQueryStarted(address, { dispatch, queryFulfilled }) {
        // 낙관적 캐시 패치
        const patch = dispatch(
          accountsApi.util.updateQueryData('fetchUserAddress', undefined, (draft) => {
            Object.assign(draft as Address, address);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo(); // 실패 롤백
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
  useLazyUserInfoQuery,      // ⬅️ 강의에서 로그인 직후 강제 조회용
  useFetchUserAddressQuery,  // ⬅️ 주소 조회
  useUpdateUserAddressMutation, // ⬅️ 주소 수정
} = accountsApi;