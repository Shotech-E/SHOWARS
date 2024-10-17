import { configureStore } from "@reduxjs/toolkit";
// import cartSlice from "./features/cart/cartSlice";
import cartReducer from "./features/cart/cartSlice";
import authApi from "./features/auth/authApi";


export const store = configureStore({
    reducer: {
    cart: cartReducer,
    [authApi.reducerPath] : authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
});

export default store;