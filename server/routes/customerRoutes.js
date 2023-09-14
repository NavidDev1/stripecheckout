const express = require("express");
const router = express.Router();
//const jwt = require('jsonwebtoken');
const {
  register,
  login,
  logout,
} = require("../controllers/customerController");
const jwt = require("jsonwebtoken");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", (req, res) => {
  res.clearCookie("auth-token");
  res.status(200).send({ message: "Logged out successfully" });
});
router.get("/status", (req, res) => {
  console.log("Checking customer status...");
  const token = req.cookies["auth-token"];
  console.log("Checking auth status. Token:", token);

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // console.log("Token verified successfully.");
      res.status(200).send({ message: ` Hi, ${decoded.username}` });
    } catch (err) {
      console.log("Token verification failed:", err.message);
      res.status(401).send();
    }
  } else {
    console.log("No token found in the request.");
    res.status(401).send();
  }
});

//.get("/customers/authorize", authorize);

module.exports = router;
