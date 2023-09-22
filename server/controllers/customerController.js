const bcrypt = require("bcrypt");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const authenticateJWT = require("../middleware/authenticateJWT");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const CLIENT_URL = "http://localhost:5173";

// Path to the JSON file that stores user data
const usersFilePath = path.join(__dirname, "../db", "customers.json");

// Array to hold the user data in memory
let users = [];

// Reading users data from the JSON file and loading it into the users array
const usersJson = fs.readFileSync(usersFilePath, "utf8");
users = JSON.parse(usersJson);

// Login function
async function login(req, res) {
  const { username, password } = req.body;

  // Finding user by username
  const user = users.find((u) => u.username === username);

  // Checking if user doesn't exist
  if (!user) {
    return res.status(401).json({ message: "Username or password is wrong" });
  }

  // Checking if password doesn't match
  if (!(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Username or password is wrong" });
  }

  // Generating JWT token if user is valid
  const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  // Storing the JWT token as an httpOnly cookie
  res.cookie("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    maxAge: 3600000, // The cookie will expire in 1 hour (value is in milliseconds)
    sameSite: "strict",
  });

  res.status(200).json({ message: ` Hi, ${username}` });
}

// Register function
async function register(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "username and password are required" });
  }
  const existingUser = users.find(
    (user) => user.username === req.body.username
  );

  // Checking if user already exists
  if (existingUser) {
    return res
      .status(409)
      .json({ message: "Email already registered, choose another one!" });
  }
  try {
    // Creating a customer in Stripe
    const createdCustomer = await stripe.customers.create({
      email: req.body.username,
      description: `Customer for ${req.body.username}`,
    });

    // Storing the Stripe customerId for the user
    const customerId = createdCustomer.id;

    // Hashing the password and saving the user data
    const user = {
      ...req.body,
      password: await bcrypt.hash(req.body.password, 10),
      stripeCustomerId: customerId,
    };

    // Adding user to the users array
    users.push(user);
    // Saving the updated users array to the JSON file
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

    // Generating JWT token after successful registration
    const token = jwt.sign(
      { username: user.username },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    // Storing JWT token as an httpOnly cookie
    res.cookie("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      maxAge: 3600000,
      sameSite: "strict",
    });

    res.status(201).json({ message: `${user.username} is registered` });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Logout function
async function logout(req, res) {
  // Clearing the auth cookie to log out the user
  res.cookie("auth-token", "", {
    expires: new Date(0),
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
  });

  res.status(200).json({ message: "Logged out" });
}

// Authorization function to check if a user is logged in
async function authorize(req, res) {
  const token = req.cookies["auth-token"];

  if (!token) {
    return res.status(401).json("You are not authenticated");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Return the decoded token or any other response you want
    res.status(200).json(decoded);
  } catch (err) {
    return res.status(401).json("Token verification failed");
  }
}

// Exporting functions to be used elsewhere in the app
module.exports = { login, logout, authorize, register };
