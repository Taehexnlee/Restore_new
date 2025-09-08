import {
    fetchBaseQuery,
    type FetchArgs,
    type FetchBaseQueryError,
    type FetchBaseQueryMeta,
    type BaseQueryFn,
  } from '@reduxjs/toolkit/query/react';
  import { startLoading, stopLoading } from '../layout/uiSlice';
import { toast } from 'react-toastify';
import { router } from '../routes/Routes';
  
  const rawBaseQuery = fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL, credentials: 'include' });
  const sleep = () => new Promise<void>((r) => setTimeout(r, 1000));
  
  // Narrowing helpers for unknown error payloads
  const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null;
  
  export const baseQueryWithErrorHandling: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError,
    object,
    FetchBaseQueryMeta
  > = async (args, api, extraOptions) => {
    api.dispatch(startLoading());
    if(import.meta.env.DEV) await sleep();
  
    const result = await rawBaseQuery(args, api, extraOptions);
  
    api.dispatch(stopLoading());
  
    if (result.error) {

      const originalStatus =
      result.error.status === 'PARSING_ERROR' && result.error.originalStatus
        ? result.error.originalStatus
        : result.error.status;

      const responseData: unknown = result.error.data;
      switch (originalStatus) {
        case 400: {
          if (typeof responseData === 'string') {
            // 문자열 본문
            toast.error(responseData);
          } else if (isRecord(responseData) && 'errors' in responseData) {
            toast.error('Validation error');
          } else if (isRecord(responseData) && typeof responseData.title === 'string') {
            // ProblemDetails 형태
            toast.error(responseData.title);
          } else {
            toast.error('Bad request');
          }
          break;
        }
        case 401: {
          if (isRecord(responseData) && typeof responseData.title === 'string') {
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
          if (isRecord(responseData) && typeof responseData.title === 'string') {
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
