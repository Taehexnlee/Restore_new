// src/features/accounts/accountsApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import type { User } from '../../app/models/user';
import type { LoginRequest, RegisterRequest } from '../../app/models/auth';
import { baseQueryWithErrorHandling } from '../../app/api/baseApi';

// ⬇️ 프로젝트에 있는 router & toast 유틸 불러오기 (강의 기준)
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
        url: '/login?useCookies=true',  // ⬅️ '/api' 제거 (baseQuery에서 자동 prefix)
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
          /* 로그인 실패 시 무시 */
        }
      },
    }),

    // 회원가입 (커스텀 AccountController)
    register: builder.mutation<void, RegisterRequest>({
      query: (creds) => ({
        url: '/account/register',   // ⬅️ '/api' 제거
        method: 'POST',
        body: creds,
        credentials: 'include',
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          // ✅ 회원가입 성공 시 토스트 + 로그인 화면으로 이동
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
        url: '/account/user-info',   // ⬅️ '/api' 제거
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['UserInfo'],
    }),

    // 로그아웃 (서버에서 인증 쿠키 삭제)
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/account/logout',   // ⬅️ '/api' 제거
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
          /* 로그아웃 실패 시 무시 */
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
  useLazyUserInfoQuery
} = accountsApi;