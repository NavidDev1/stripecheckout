require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const verifyJWT = require("../middleware/auth");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

//creating a varible to hold the express router
const router = express.Router();

const CLIENT_URL = "http://localhost:5173";

const authenticateJWT = (req, res, next) => {
  const token = req.cookies["auth-token"];

  if (!token) return res.status(401).json("No token provided");

  try {
    const decoded = jwt.verify(token, "your_secret_key");
    console.log(decoded);
    req.username = decoded.username; // Passing email to the next middleware

    next();
  } catch (err) {
    console.log(token);
    res.status(408).send("Invalid token");
  }
};

router.post("/create-checkout-session", authenticateJWT, async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: req.body.map((item) => {
        return {
          price: item.product,
          quantity: item.quantity,
        };
      }),
      mode: "payment",
      success_url: `${CLIENT_URL}/confirmation`,
      cancel_url: CLIENT_URL,
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
