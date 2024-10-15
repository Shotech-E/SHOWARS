const express = require("express");
const User = require("./userModel");
const generateAuthToken = require("../middleware/generateAuthToken");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();

// Register Endpoint
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email, password });
    await user.save();
    res.status(201).send({ message: "User created successfully" });
  } catch (error) {
    console.log("Error in creating user", error);
    res.status(500).send({ message: "Error in creating user" });
  }
});

// Login Endpoint
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(404).send({ message: "Invalid credentials" });
    }

      const token = await generateAuthToken(user.id);
    //   console.log("token:", token);
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });

      
    res.status(200).send({
        message: "Logged in successful", token, user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        profileImage: user.profileImage,
        bio: user.bio,
        profession: user.profession
    } });
        

  } catch (error) {
    console.log("Error in login", error);
    res.status(500).send({ message: "Error in login" });
  }
});

// All Users Endpoint
router.get("/users", verifyToken, async (req, res) => {
  res.send({message: "Protected Users"});
});

module.exports = router;
