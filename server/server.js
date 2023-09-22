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

app.use(cookieParser());

app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.path);
  next();
});

//Middlewares
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// here we are are using are routes
app.use("/api/customers", customerRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/", productRoutes);

app.listen(3000, () => console.log("Server is up and running.."));
