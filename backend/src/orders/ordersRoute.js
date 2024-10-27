const express = require("express");
const router = express.Router();
const Orders = require("./ordersModel");

const stripe = require("stripe")(
  "sk_test_51QE7lZLe2VbPgG0NBFeRqJ6noTxWLyLLWhYkzUvhjuoFcCwWrKPO8bv93T3UFvbh10cwMK2Ai9t2m6Dm0RXBh4zF00f1JAEL1P"
);
// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// CREATE CHECKOUT SESSION
router.post("/create-checkout-session", async (req, res) => {
    const { products } = req.body;
    try {
        const lineItems = products.map((product) => ({
            price_data: {
                currency: "usd",
                product_data: {
                    name: product.name,
                    images: [product.image],
                },
                unit_amount: Math.round(product.price * 100),
            },
            quantity: product.quantity,
        }));

        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: lineItems,
          mode: "payment",
          success_url: `http://localhost:5173/success?session_id={CHECK_SESSION_ID}`,
          cancel_url: `http://localhost:5173/cancel`,
        });
        res.json({ id: session.id });
        
    } catch (error) {
        console.error("Error creating checkout session", error);
        res.status(500).send({ message: "Error creating checkout session" });
        
    }
})

// CONFIRM PAYMENT
router.post("/confirm-payment", async (req, res) => {
    const {sessionId} = req.body
    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId, {
            expand: ["line_items", "payment_intent"],
        });

        const paymentIntentId = session.payment_intent;
        let order = await Orders.findOne({ paymentIntentId });

        if (!order) {
            const lineItems = session.line_items.data.map((item) => ({
                productId: item.price.product,
                quantity: item.quantity,
            }));

            const amount = session.amount_total / 100;
            order = new Orders({
                orderId: paymentIntentId,
                products: lineItems,
                amount: amount,
                email: session.customer_details.email,
                status: session.payment_status === "paid" ? "pending" : "failed",
            })
        } else {
            order.status = session.payment_status === "paid" ? "pending" : "failed";
        }
        await order.save();
        res.json({order})

    } catch (error) {
        console.error("Error confirming payment", error);
        res.status(500).send({ message: "Error confirming payment" });
    }

})

module.exports = router;