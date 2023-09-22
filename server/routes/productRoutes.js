const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { showProducts } = require("../controllers/productsController");

router.get("/", async (req, res) => {
  try {
    const products = await showProducts();
    res.status(200).json(products);
    //console.log(products);
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Serverfel");
  }
});

module.exports = router;
