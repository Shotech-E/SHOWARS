const express = require("express");
const User = require("../users/userModel");
const Order = require("../orders/ordersModel");
const Reviews = require("../reviews/reviewsModel");
const router = express.Router();

// GET USER STATS BY EMAIL
router.get("/user-stats/:email", async (req, res) => {
    const { email } = req.params;
    if (!email) { 
        return res.status(400).send({ message: "Email is required" });
    }
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).send({ message: "User not found" });
        }
        // res.status(200).send({ user });

        // sum of all orders
        const totalPaymentResult = await Order.aggregate([
            { $match: { email: email } },
            { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
        ]);
        const totalPaymentAmount = totalPaymentResult.length > 0 ? totalPaymentResult[0].totalAmount : 0;

        // get total reviews
        const totalReviews = await Reviews.countDocuments({ userId: user._id });

        // get total products purchased
        const purchasedProductIds = await Order.distinct("products.productId", { email: email });
        const totalProductsPurchased = purchasedProductIds.length;

        res.status(200).send({ totalPaymentAmount, totalReviews, totalProductsPurchased });
        
    } catch (error) {
        console.error("Error getting user stats by email", error);
        res.status(500).send({ message: "Failed getting user stats by email" });
    }
})

module.exports = router