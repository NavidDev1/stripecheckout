require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");

// taking in the routes
const checkoutRoutes = require("./routes/checkoutRoutes");
const productRoutes = require("./routes/productRoutes");
const customerRoutes = require("./routes/customerRoutes");

app.use(express.json());

const CLIENT_URL = "http://localhost:5173";

//Middlewares
app.use(
  cors({
    origin: "http://localhost:5173",
    //credentials: true,
  })
);

app.use(cookieParser());

// here we are are using are routes
app.use("/customers", customerRoutes);
app.use("/checkout", checkoutRoutes);
app.use("/", productRoutes);

app.listen(3000, () => console.log("Server is up and running.."));
