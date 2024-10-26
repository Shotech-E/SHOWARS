import { configureStore } from "@reduxjs/toolkit";
import productApi from "./features/products/productsApi"; 
import cartReducer from "./features/cart/cartSlice";
import authApi from "./features/auth/authApi";
import authReducer from "./features/auth/authSlice";
import reviewApi from "./features/reviews/reviewsApi";

export const store = configureStore({
    reducer: {
    cart: cartReducer,
    [authApi.reducerPath]: authApi.reducer,
    auth: authReducer,
    [productApi.reducerPath]: productApi.reducer,
    [reviewApi.reducerPath]: reviewApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, productApi.middleware, reviewApi.middleware),
});

export default store;