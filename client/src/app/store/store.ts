import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, type TypedUseSelectorHook, useSelector } from "react-redux";
import counterReducer from "../../features/contact/counterReducer";
import uiReducer from "../layout/uiSlice";
import { catalogApi } from "../../features/catalog/catalogApi";
import { errorApi } from "../../features/about/errorApi";
import { basketApi } from "../basket/basketApi";
import { catalogSlice } from "../../features/catalog/catalogSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    ui: uiReducer, // ✅ 추가
    catalog : catalogSlice.reducer,
    [catalogApi.reducerPath]: catalogApi.reducer,
    [errorApi.reducerPath]: errorApi.reducer,
    [basketApi.reducerPath]: basketApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(catalogApi.middleware, errorApi.middleware, basketApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;