import { configureStore } from "@reduxjs/toolkit";
// import cartSlice from "./features/cart/cartSlice";

import cartReducer from "./features/cart/cartSlice";


export const store = configureStore({
    reducer: {
      cart: cartReducer
  },
});

export default store;