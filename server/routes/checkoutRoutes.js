require("dotenv").config();
const express = require("express");
const authenticateJWT = require("../middleware/authenticateJWT");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

//creating a varible to hold the express router
const router = express.Router();

const CLIENT_URL = "http://localhost:5173";

router.post("/create-checkout-session", authenticateJWT, async (req, res) => {
  console.log("Hit /create-checkout-session route");
  try {
    const { cart } = req.body;

    // Extracting username (email) from the JWT payload
    const email = req.user.username;

    const session = await stripe.checkout.sessions.create({
      line_items: cart.map((item) => {
        return {
          price: item.product,
          quantity: item.quantity,
        };
      }),
      mode: "payment",
      success_url: `${CLIENT_URL}/confirmation`,
      cancel_url: CLIENT_URL,
      customer_email: email, // Useing the extracted email here
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
