import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../../redux/features/cart/cartSlice";
import { getBaseUrl } from "../../utils/baseURL";
import { loadStripe } from "@stripe/stripe-js";
import { useNavigate } from "react-router-dom"; // To navigate to the login page if needed

const OrderSummary = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth); // User state
  const products = useSelector((state) => state.cart.products);
  const { selectedItems, totalPrice, tax, taxRate, grandTotal } = useSelector(
    (state) => state.cart
  );

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const makePayment = async () => {
    if (!user) {
      // User is not logged in, redirect to login page
      alert("Please log in to proceed with the payment.");
      navigate("/login"); // Redirect to the login page (modify the path if needed)
      return;
    }

    try {
      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PK);

      if (!stripe) {
        console.error("Stripe initialization failed!");
        return;
      }

      const body = {
        products,
        userId: user?._id,
      };

      const response = await fetch(
        `${getBaseUrl()}/api/orders/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const session = await response.json();

      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        console.error("Stripe Checkout Error:", result.error.message);
      } else {
        // Payment succeeded, clear the cart
        dispatch(clearCart());
      }
    } catch (error) {
      console.error("Payment Error:", error.message);
    }
  };
<<<<<<< HEAD

  // const makeNairaPayment = async () => {
  //   if (!user?.email) {
  //     console.error("User email is missing.");
  //     alert("Please ensure you are logged in with a valid email address.");
  //     return;
  //   }

  //   const body = {
  //     products: products,
  //     userId: user?._id,
  //     email: user?.email, // Include the user's email
  //   };

  //   const headers = {
  //     "Content-Type": "application/json",
  //   };

  //   try {
  //     console.log("Sending payment request with body:", body);

  //     // Request to get the payment details from the backend
  //     const response = await fetch(
  //       `${getBaseUrl()}/api/orders/create-naira-checkout-session`,
  //       {
  //         method: "POST",
  //         headers: headers,
  //         body: JSON.stringify(body),
  //       }
  //     );

  //     if (!response.ok) {
  //       const errorDetails = await response.json();
  //       console.error("Backend error:", errorDetails);
  //       throw new Error("Failed to create payment session");
  //     }

  //     const { checkoutUrl } = await response.json();

  //     // Redirect to Monnify Checkout
  //     if (checkoutUrl) {
  //       window.location.href = checkoutUrl;
  //     } else {
  //       console.error("Failed to initialize payment: Checkout URL is missing.");
  //     }
  //   } catch (error) {
  //     console.error("Payment Error:", error);
  //   }
  // };
=======
>>>>>>> 929bf0563c964053f1cd23e41e73b66b2f5d8028

  return (
    <div className="bg-gray-100 mt-5 rounded-lg text-base shadow-md">
      <div className="px-6 py-4 space-y-5">
        <h2 className="text-xl font-semibold text-gray-800">Order Summary</h2>
        <p>Selected Items: {selectedItems}</p>
<<<<<<< HEAD
        <p>Total: &#8358;{totalPrice.toFixed(2)}</p>
        <p>
          Tax ({(taxRate * 100).toFixed(1)}%): &#8358;{tax.toFixed(2)}
        </p>
        <h3 className="font-bold">
          Grand Total:{" "}
          <span className="text-green-600">&#8358;{grandTotal.toFixed(2)}</span>
=======
        <p>Total: ${totalPrice.toFixed(2)}</p>
        <p>
          Tax ({(taxRate * 100).toFixed(1)}%): ${tax.toFixed(2)}
        </p>
        <h3 className="font-bold">
          Grand Total:{" "}
          <span className="text-green-600">${grandTotal.toFixed(2)}</span>
>>>>>>> 929bf0563c964053f1cd23e41e73b66b2f5d8028
        </h3>
        <div className="flex flex-col gap-4">
          <button
            onClick={handleClearCart}
            className="bg-red-500 px-4 py-2 text-white rounded-md hover:bg-red-600 transition-all"
          >
            <span className="flex items-center justify-center gap-2">
              <i className="ri-delete-bin-line"></i> Clear Cart
            </span>
          </button>
          <button
            onClick={makePayment}
            className="bg-green-500 px-4 py-2 text-white rounded-md hover:bg-green-600 transition-all"
          >
            <span className="flex items-center justify-center gap-2">
<<<<<<< HEAD
              <i className="ri-bank-card-line"></i>Checkout
=======
              <i className="ri-bank-card-line"></i> Checkout
>>>>>>> 929bf0563c964053f1cd23e41e73b66b2f5d8028
            </span>
          </button>
          {/* <button
            onClick={makeNairaPayment}
            className="bg-orange-500 px-4 py-2 text-white rounded-md hover:bg-orange-600 transition-all"
          >
            <span className="flex items-center justify-center gap-2">
              <i className="ri-bank-card-line"></i> Naira Checkout
            </span>
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;