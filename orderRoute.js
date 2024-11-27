const express = require("express");
const axios = require("axios");
const router = express.Router();
const Order = require("./ordersModel");
const verifyToken = require("../middleware/verifyToken");
const verifyAdmin = require("../middleware/verifyAdmin");

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

// CREATE CHECKOUT SESSION
router.post("/paystack-session", async (req, res) => {
  const { products, userId, email } = req.body; // Ensure email is passed in the request body

  const totalAmount =
    products.reduce(
      (sum, product) => sum + product.price * product.quantity,
      0
    ) * 100; // Paystack expects amount in kobo

  const requestData = {
    amount: totalAmount,
    email, // Add the email field here
    callback_url: "http://localhost:5173/success",
    metadata: {
      userId,
      products,
    },
  };

  try {
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      requestData,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const { authorization_url, reference } = response.data.data;
    res.json({ authorization_url, reference });
  } catch (error) {
    console.error("Error initializing Paystack session", error);
    res.status(500).json({ error: "Failed to initialize payment session" });
  }
});

// VERIFY TRANSACTION
router.get("/verify-transaction/:reference", async (req, res) => {
  const { reference } = req.params;

  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const { data } = response.data;

    console.log("Verification Response Data:", data);

    if (data.status === "success") {
      const { metadata, amount, customer } = data;

      if (
        !metadata ||
        !metadata.userId ||
        !metadata.products ||
        !customer?.email
      ) {
        return res.status(400).json({ error: "Invalid transaction data" });
      }

      // Create and save new order
      const order = new Order({
        orderId: reference,
        products: metadata.products,
        amount: amount / 100, // Convert kobo to Naira
        email: customer.email,
        status: "completed", // Set to completed since transaction succeeded
      });

      await order.save();

      res.status(201).json({ message: "Transaction successful", order });
    } else {
      res.status(400).json({ error: "Transaction verification failed" });
    }
  } catch (error) {
    console.error(
      "Error verifying transaction:",
      error.response?.data || error.message
    );
    res
      .status(500)
      .json({ error: "Failed to verify transaction", details: error.message });
  }
});

// get all orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    if (orders.length === 0) {
      return res.status(404).send({ message: "No orders found", orders: [] });
    }

    res.status(200).send(orders);
  } catch (error) {
    console.error("Error fetching all orders", error);
    res.status(500).send({ message: "Failed to fetch all orders" });
  }
});

// update order status
router.patch("/update-order-status/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).send({ message: "Status is required" });
  }

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      {
        status,
        updatedAt: new Date(),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedOrder) {
      return res.status(404).send({ message: "Order not found" });
    }

    res.status(200).json({
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order status", error);
    res.status(500).send({ message: "Failed to update order status" });
  }
});

// delete order
router.delete("/delete-order/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).send({ message: "Order not found" });
    }

    res.status(200).json({
      message: "Order deleted successfully",
      order: deletedOrder,
    });
  } catch (error) {
    console.error("Error deleting order", error);
    res.status(500).send({ message: "Failed to delete order" });
  }
});

module.exports = router;
