import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, type TypedUseSelectorHook, useSelector } from "react-redux";
import counterReducer from "../../features/contact/counterReducer";
import uiReducer from "../layout/uiSlice";
import { catalogApi } from "../../features/catalog/catalogApi";
import { errorApi } from "../../features/about/errorApi";
import { basketApi } from "../basket/basketApi";
import { catalogSlice } from "../../features/catalog/catalogSlice";
import { accountsApi } from "../../features/account/accountsApi";
import { checkoutApi } from "../../features/checkout/checkoutApi";
import { ordersApi } from "../../features/orders/ordersApi";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    ui: uiReducer, // UI theme and loading state
    catalog : catalogSlice.reducer,
    [catalogApi.reducerPath]: catalogApi.reducer,
    [errorApi.reducerPath]: errorApi.reducer,
    [basketApi.reducerPath]: basketApi.reducer,
    [accountsApi.reducerPath]: accountsApi.reducer,
    [checkoutApi.reducerPath]: checkoutApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(catalogApi.middleware, errorApi.middleware, basketApi.middleware, accountsApi.middleware, checkoutApi.middleware, ordersApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
