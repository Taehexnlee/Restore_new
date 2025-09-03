import {
    fetchBaseQuery,
    type FetchArgs,
    type FetchBaseQueryError,
    type FetchBaseQueryMeta,
    type BaseQueryFn,
  } from '@reduxjs/toolkit/query/react';
  import { startLoading, stopLoading } from '../layout/uiSlice';
import { toast } from 'react-toastify';
import type { ErrorResponse } from 'react-router';
import { router } from '../routes/Routes';
  
  const rawBaseQuery = fetchBaseQuery({ baseUrl: 'https://localhost:5001/api' });
  const sleep = () => new Promise<void>((r) => setTimeout(r, 1000));
  
  export const baseQueryWithErrorHandling: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError,
    object,
    FetchBaseQueryMeta
  > = async (args, api, extraOptions) => {
    api.dispatch(startLoading());
    await sleep();
  
    const result = await rawBaseQuery(args, api, extraOptions);
  
    api.dispatch(stopLoading());
  
    if (result.error) {

      const originalStatus =
      result.error.status === 'PARSING_ERROR' && result.error.originalStatus
        ? result.error.originalStatus
        : result.error.status;

      const responseData = result.error.data as ErrorResponse;
      switch (originalStatus) {
        case 400: {
          if (typeof responseData === 'string') {
            // 문자열 본문
            toast.error(responseData);
          } else if (typeof responseData === 'object' && 'errors' in responseData) {
            toast.error('Validation error');
          } else if (typeof responseData === 'object' && 'title' in responseData) {
            // ProblemDetails 형태
            toast.error(responseData.title);
          } else {
            toast.error('Bad request');
          }
          break;
        }
        case 401: {
          if (typeof responseData === 'object' && 'title' in responseData) {
            toast.error(responseData.title);
          } else {
            toast.error('Unauthorized');
          }
          break;
        }
        case 404: {
          router.navigate('/not-found');          // ✅ 전용 페이지로 이동
          break;
        }
        case 500: {
          if (typeof responseData === 'object' && 'title' in responseData) {
            router.navigate('/server-error', {
              state: { error : responseData },
            });          
          } else {
            toast.error('Server error: please try again later.');
          }
          break;
        }
        default: {
          toast.error('Unexpected error');
        }
      }
  }
    return result;
  }; 