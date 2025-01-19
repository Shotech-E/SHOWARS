const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();
const Order = require("./ordersModel");
const verifyToken = require("../middleware/verifyToken");
const verifyAdmin = require("../middleware/verifyAdmin");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

router.post("/create-checkout-session", async (req, res) => {
  const { products } = req.body;

  try {
    // Calculate the total amount in NGN
    const lineItems = products.map((product) => ({
      price_data: {
        currency: "ngn", // Use Naira for the currency
        product_data: {
          name: product.name,
          images: [product.image],
        },
        unit_amount: Math.round(product.price * 100), // Convert price to kobo
      },
      quantity: product.quantity,
    }));

    // Calculate total session amount in NGN
    const totalAmountNGN = products.reduce(
      (sum, product) => sum + product.price * product.quantity,
      0
    );

    // Check if total session amount meets minimum threshold
    const totalAmountUSD = totalAmountNGN / 780; // Approximate exchange rate
    if (totalAmountUSD < 0.5) {
      throw new Error(
        `The total amount must be at least ₦380 to meet the $0.50 minimum threshold.`
      );
    }

    // Create the checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:5173/cancel`,
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Error creating checkout session", error.message);
    res.status(400).json({ error: error.message });
  }
});



// CONFIRM PAYMENT
router.post("/confirm-payment", async (req, res) => {
  const { session_id } = req.body;
  try {
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items", "payment_intent"],
    });

    const paymentIntentId = session.payment_intent.id;
    let order = await Order.findOne({ orderId: paymentIntentId });

    if (!order) {
      const lineItems = session.line_items.data.map((item) => ({
        productId: item.price.product,
        quantity: item.quantity,
      }));

      const amount = session.amount_total / 100;
      order = new Order({
        orderId: paymentIntentId,
        amount,
        products: lineItems,
        email: session.customer_details.email,
        status:
          session.payment_intent.status === "succeeded" ? "pending" : "failed",
      });
    } else {
      order.status =
        session.payment_intent.status === "succeeded" ? "pending" : "failed";
    }
    await order.save();
    res.json({ order });
  } catch (error) {
    console.error("Error confirming payment", error);
    res.status(500).json({ error: "Failed confirming payment" });
  }
});

// // CREATE NAIRA PAYMENT SESSION
// router.post("/create-naira-checkout-session", async (req, res) => {
//   const { products, email } = req.body;

//   if (!email) {
//     return res.status(400).json({ error: "Email is required" });
//   }

//   try {
//     // Your existing logic here
//     const authResponse = await axios.post(
//       `${process.env.MONNIFY_BASE_URL}/api/v1/auth/login`,
//       {},
//       {
//         auth: {
//           username: process.env.MONNIFY_API_KEY,
//           password: process.env.MONNIFY_SECRET_KEY,
//         },
//       }
//     );

//     const accessToken = authResponse.data.responseBody.accessToken;

//     const totalAmount = products.reduce(
//       (sum, product) => sum + product.price * product.quantity,
//       0
//     );

//     const paymentResponse = await axios.post(
//       `${process.env.MONNIFY_BASE_URL}/api/v1/merchant/transactions/init-transaction`,
//       {
//         amount: totalAmount,
//         customerName: "Customer Name",
//         customerEmail: email,
//         paymentReference: `ORDER-${Date.now()}`,
//         paymentDescription: "Purchase of items",
//         currencyCode: "NGN",
//         contractCode: process.env.MONNIFY_CONTRACT_CODE,
//         redirectUrl: "http://localhost:5173/success",
//         paymentMethods: ["CARD", "ACCOUNT_TRANSFER"],
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       }
//     );

//     const checkoutUrl = paymentResponse.data.responseBody.checkoutUrl;

//     res.json({ checkoutUrl });
//   } catch (error) {
//     console.error(
//       "Error creating payment session:",
//       error.response?.data || error.message
//     );
//     res.status(500).json({ error: "Failed creating payment session" });
//   }
// });


// CONFIRM NAIRA PAYMENT
// router.post("/confirm-naira payment", async (req, res) => {
//   const { paymentReference } = req.body;

//   try {
//     // Authenticate with Monnify API
//     const authResponse = await axios.post(
//       `${process.env.MONNIFY_BASE_URL}/api/v1/auth/login`,
//       {},
//       {
//         auth: {
//           username: process.env.MONNIFY_API_KEY,
//           password: process.env.MONNIFY_SECRET_KEY,
//         },
//       }
//     );

//     const accessToken = authResponse.data.responseBody.accessToken;

//     // Verify the transaction
//     const verificationResponse = await axios.get(
//       `${process.env.MONNIFY_BASE_URL}/api/v2/transactions/${paymentReference}`,
//       {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       }
//     );

//     const transactionStatus =
//       verificationResponse.data.responseBody.paymentStatus;

//     if (transactionStatus === "PAID") {
//       // Update order status to "paid"
//       res.json({ status: "success", message: "Payment confirmed." });
//     } else {
//       res
//         .status(400)
//         .json({ status: "failed", message: "Payment not completed." });
//     }
//   } catch (error) {
//     console.error(
//       "Error confirming payment:",
//       error.response?.data || error.message
//     );
//     res.status(500).json({ error: "Failed confirming payment" });
//   }
// });

// router.post("/confirm-Naira-payment", async (req, res) => {
//   const { paymentReference } = req.body;

//   if (!paymentReference) {
//     return res.status(400).json({ error: "Payment reference is required" });
//   }

//   try {
//     // Authenticate with Monnify API to get access token
//     const authResponse = await axios.post(
//       `${process.env.MONNIFY_BASE_URL}/api/v1/auth/login`,
//       {},
//       {
//         auth: {
//           username: process.env.MONNIFY_API_KEY,
//           password: process.env.MONNIFY_SECRET_KEY,
//         },
//       }
//     );

//     const accessToken = authResponse.data.responseBody.accessToken;

//     // Verify the payment using Monnify API
//     const paymentVerificationResponse = await axios.get(
//       `${process.env.MONNIFY_BASE_URL}/api/v1/merchant/transactions/query?paymentReference=${paymentReference}`,
//       {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       }
//     );

//     const paymentDetails = paymentVerificationResponse.data.responseBody;

//     // Check the payment status
//     if (paymentDetails.paymentStatus !== "PAID") {
//       return res.status(400).json({ error: "Payment not successful" });
//     }

//     // Extract necessary details
//     const { totalAmountPaid, customerEmail, paymentMethod, items } =
//       paymentDetails;

//     // Check if the order already exists
//     let order = await Order.findOne({ orderId: paymentReference });

//     if (!order) {
//       // Save the order to the database
//       order = new Order({
//         orderId: paymentReference,
//         amount: totalAmountPaid,
//         email: customerEmail,
//         paymentMethod,
//         products: items.map((item) => ({
//           productId: item.productCode, // Ensure your Monnify setup passes product codes
//           quantity: item.quantity,
//         })),
//         status: "completed", // Update the status based on Monnify's response
//       });

//       await order.save();
//     }

//     res.json({ order });
//   } catch (error) {
//     console.error(
//       "Error confirming Naira payment:",
//       error.response?.data || error.message
//     );
//     res.status(500).json({ error: "Failed to confirm payment" });
//   }
// });

// GET ORDER BY email address
router.get("/:email", async (req, res) => {
  const email = req.params.email;
  if (!email) {
    return res.status(400).send({ message: "Email is required" });
  }
  try {
    const orders = await Order.find({ email: email });
    if (orders.length === 0 || !orders) {
      return res
        .status(400)
        .send({ orders: 0, message: "No order found for this email" });
    }
    res.status(200).send({ orders });
  } catch (error) {
    console.error("Error getting order by email", error);
    res.status(500).send({ message: "Failed getting order by email" });
  }
});

// get order by Id
router.get("/order/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).send({ message: "Order not found" });
    }
    res.status(200).send(order);
  } catch (error) {
    console.error("Error getting order by ID", error);
    res.status(500).send({ message: "Failed getting order by ID" });
  }
});

// GET ALL ORDERS
router.get("/", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    if (orders.length === 0) {
      return res.status(404).send({ message: "No order found", orders: [] });
    }
    res.status(200).send(orders);
  } catch (error) {
    console.error("Error getting all orders", error);
    res.status(500).send({ message: "Failed getting all orders" });
  }
});

// UPDATE ORDER STATUS
router.patch("/update-order-status/:id", verifyToken, verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!status) {
    return res.status(400).send({ message: "Status is required" });
  }
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status, updatedAt: Date.now() },
      { new: true, runValidators: true }
      );
      
    if (!updatedOrder) {
      return res.status(404).send({ message: "Order not found" });
    }
      res.status(200).send({ message: "Order updated successfully", order: updatedOrder });
  } catch (error) {
    console.error("Error updating order status", error);
    res.status(500).send({ message: "Failed updating order status" });
  }
});

// DELETE ORDER
router.delete(
  "/delete-order/:id",
  verifyToken,
  verifyAdmin,
  async (req, res) => {
    const { id } = req.params;
    try {
      const deletedOrder = await Order.findByIdAndDelete(id);
      if (!deletedOrder) {
        return res.status(404).send({ message: "Order not found" });
      }
      res
        .status(200)
        .send({ message: "Order deleted successfully", order: deletedOrder });
    } catch (error) {
      console.error("Error deleting order", error);
      res.status(500).send({ message: "Failed deleting order" });
    }
  }
);

module.exports = router;
