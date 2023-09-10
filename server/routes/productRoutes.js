const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

router.get("/", async (req, res) => {
  try {
    const products = await stripe.products.list();
    res.status(200).json(products.data);
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Serverfel");
  }
});

module.exports = router;
