/* eslint-disable no-unused-vars */
// import { useSelector, useDispatch } from "react-redux";
// import { clearCart } from "../../redux/features/cart/cartSlice";
// import { getBaseUrl } from "../../utils/baseURL";
// const OrderSummary = () => {
//   const dispatch = useDispatch();
//   const { user } = useSelector((state) => state.auth);
//   const products = useSelector((state) => state.cart.products);

//   const { selectedItems, totalPrice, tax, taxRate, grandTotal } = useSelector(
//     (store) => store.cart
//   );


//   const handleClearCart = () => {
//     dispatch(clearCart());
//   };

//   // Payment integration using Paystack
//   const makePayment = async () => {
//     const body = {
//       products: products,
//       userId: user?._id,
//       email: user?.email, // Include the user's email
//     };

//     const headers = {
//       "Content-Type": "application/json",
//     };

//     try {
//       // Request to get the authorization details from the backend
//       const response = await fetch(
//         `${getBaseUrl()}/api/orders/paystack-session`,
//         {
//           method: "POST",
//           headers: headers,
//           body: JSON.stringify(body),
//         }
//       );

//       const { authorization_url } = await response.json();

//       // Redirect to Paystack Checkout
//       if (authorization_url) {
//         window.location.href = authorization_url;
//       } else {
//         console.error("Failed to initialize payment");
//       }
//     } catch (error) {
//       console.error("Payment Error:", error);
//     }
//   };

//   return (
//     <div className="bg-primary-light mt-5 rounded text-base">
//       <div className="px-6 py-4 space-y-5">
//         <h2 className="text-xl text-text-dark">Order Summary</h2>
//         <p>Selected Items: {selectedItems}</p>
//         <p>Total: {totalPrice.toFixed(2)}</p>
//         <p>
//           Tax ({taxRate * 100}%): ${tax.toFixed(2)}
//         </p>
//         <h3 className="font-bold">
//           Grand Total:
//           <span className="text-primary">${grandTotal.toFixed(2)}</span>
//         </h3>
//         <div className="px-4 mb-6">
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               handleClearCart();
//             }}
//             className="bg-red-500 px-3 py-1.5 text-white mt-2 rounded-md flex justify-between items-center mb-4"
//           >
//             <span className="mr-2">Clear Cart</span>
//             <i className="ri-delete-bin-line"></i>
//           </button>

//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               makePayment();
//             }}
//             className="bg-green-500 px-3 py-1.5 text-white mt-2 rounded-md flex justify-between items-center"
//           >
//             <span className="mr-2">Checkout</span>
//             <i className="ri-bank-card-line"></i>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default OrderSummary;

/* eslint-disable no-unused-vars */
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../../redux/features/cart/cartSlice";
import { getBaseUrl } from "../../utils/baseURL";

const OrderSummary = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const products = useSelector((state) => state.cart.products);

  const { selectedItems, totalPrice, tax, taxRate, grandTotal } = useSelector(
    (store) => store.cart
  );

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  // Payment integration using Monnify
  const makePayment = async () => {
    const body = {
      products: products,
      userId: user?._id,
      email: user?.email, // Include the user's email
    };

    const headers = {
      "Content-Type": "application/json",
    };

    try {
      // Request to get the payment details from the backend
      const response = await fetch(
        `${getBaseUrl()}/api/orders/monnify-session`,
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify(body),
        }
      );

      const { checkoutUrl } = await response.json();

      // Redirect to Monnify Checkout
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        console.error("Failed to initialize payment");
      }
    } catch (error) {
      console.error("Payment Error:", error);
    }
  };

  return (
    <div className="bg-primary-light mt-5 rounded text-base">
      <div className="px-6 py-4 space-y-5">
        <h2 className="text-xl text-text-dark">Order Summary</h2>
        <p>Selected Items: {selectedItems}</p>
        <p>Total: {totalPrice.toFixed(2)}</p>
        <p>
          Tax ({taxRate * 100}%): ${tax.toFixed(2)}
        </p>
        <h3 className="font-bold">
          Grand Total:
          <span className="text-primary">${grandTotal.toFixed(2)}</span>
        </h3>
        <div className="px-4 mb-6">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleClearCart();
            }}
            className="bg-red-500 px-3 py-1.5 text-white mt-2 rounded-md flex justify-between items-center mb-4"
          >
            <span className="mr-2">Clear Cart</span>
            <i className="ri-delete-bin-line"></i>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              makePayment();
            }}
            className="bg-green-500 px-3 py-1.5 text-white mt-2 rounded-md flex justify-between items-center"
          >
            <span className="mr-2">Checkout</span>
            <i className="ri-bank-card-line"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
