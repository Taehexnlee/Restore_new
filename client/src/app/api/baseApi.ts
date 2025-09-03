import {
    fetchBaseQuery,
    type FetchArgs,
    type FetchBaseQueryError,
    type FetchBaseQueryMeta,
    type BaseQueryFn,
  } from '@reduxjs/toolkit/query/react';
  import { startLoading, stopLoading } from '../layout/uiSlice';
  
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
  
    if ('error' in result && result.error) {
      const err = result.error;
      // eslint-disable-next-line no-console
      console.log({ status: err.status, data: err.data });
    }
  
    return result;
  };