require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

// taking in the routes
const checkoutRoutes = require("./routes/checkoutRoutes");
const productRoutes = require("./routes/productRoutes");

app.use(express.json());

const CLIENT_URL = "http://localhost:5173";

//Middlewares
app.use(
  cors({
    origin: "*",
  })
);

// here we are are using are routes
app.use("/checkout", checkoutRoutes);
app.use("/", productRoutes);

app.listen(3000, () => console.log("Server is up and running.."));
