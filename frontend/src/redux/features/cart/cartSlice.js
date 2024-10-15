import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  selectedItems: 0,
  totalPrice: 0,
  tax: 0,
  taxRate: 0.05,
  grandTotal: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const isExist = state.products.find(
        (product) => product.id === action.payload.id
      );

      if (!isExist) {
        state.products.push({ ...action.payload, quantity: 1 });
      } else {
        console.log("Items already exist");
      }

      state.selectedItems = setSelectedItems(state);
      state.totalPrice = setTotalPrice(state);
      state.tax = setTax(state);
      state.grandTotal = setGrandTotal(state);
    },

    updateQuantity: (state, action) => {
      // eslint-disable-next-line no-unused-vars
      const products = state.products.map((product) => {
        if (product.id === action.payload.id) {
          if (action.payload.type === "inc") {
            product.quantity += 1;
          } else if (action.payload.type === "dec") {
            product.quantity -= 1;
          }
        }
        return product;
      });
        
        state.selectedItems = setSelectedItems(state);
        state.totalPrice = setTotalPrice(state);
        state.tax = setTax(state);
        state.grandTotal = setGrandTotal(state);
    },
  },
});

// Utilities function
export const setSelectedItems = (state) =>
  state.products.reduce((total, product) => {
    return Number(total + product.quantity);
  }, 0);

export const setTotalPrice = (state) =>
  state.products.reduce((total, product) => {
    return Number(total + product.quantity * product.price);
  }, 0);

export const setTax = (state) => setTotalPrice(state) * state.taxRate;

export const setGrandTotal = (state) => {
  return setTotalPrice(state) + setTotalPrice(state) * state.taxRate;
};

export const { addToCart } = cartSlice.actions;
export default cartSlice.reducer;
