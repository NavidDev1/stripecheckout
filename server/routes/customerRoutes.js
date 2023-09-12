const express = require("express");
const cookieParser = require("cookie-parser");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");

// construct the path to the customerdb
const usersFilePath = path.join(__dirname, "..", "db", "customers.json");
const ordersFilePath = path.join(__dirname, "..", "db", "orders.json");

// Load user data from JSON file (your basic database)
const usersDB = JSON.parse(fs.readFileSync(usersFilePath));

// Secret key for JWT
const jwtSecret = "your-secret-key";

// Register endpoint
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the username is already taken
    if (usersDB.find((user) => user.username === username)) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user data to the database
    usersDB.push({ username, password: hashedPassword });
    fs.writeFileSync(usersFilePath, JSON.stringify(usersDB));

    res.status(200).json({ message: "Registration successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Login endpoint
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by username
    const user = usersDB.find((user) => user.username === username);

    // Check if the user exists
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // Verify the password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Generate a JWT token
    const token = jwt.sign({ username }, jwtSecret);

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Protected route example
router.get("/protected", (req, res) => {
  try {
    // Verify JWT token before granting access
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, jwtSecret);
    res.status(200).json({ message: "Access granted to protected route" });
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: "Unauthorized" });
  }
});

module.exports = router;
