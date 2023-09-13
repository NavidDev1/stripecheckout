const express = require("express");
const router = express.Router();

const {
  register,
  login,
  logout,
} = require("../controllers/customerController");
const jwt = require("jsonwebtoken");

router.post("/customers/register", register);
router.post("/customers/login", login);
router.post("/customers/logout", logout);
router.get("/customers/status", (req, res) => {
  const token = req.cookies["auth-token"];
  // console.log("Checking auth status. Token:", token);

  if (token) {
    try {
      const decoded = jwt.verify(token, "your_secret_key");
      // console.log("Token verified successfully.");
      res.status(200).send({ message: ` Hi, ${decoded.username}` });
    } catch (err) {
      console.log("Token verification failed:", err.message);
      res.status(401).send();
    }
  } else {
    // console.log("No token found in the request.");
    res.status(401).send();
  }
});

// .get("/customers/authorize", authorize);

module.exports = router;
