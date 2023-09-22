const jwt = require("jsonwebtoken");

const authenticateJWT = (req, res, next) => {
  console.log("Authenticating JWT for request:", req.method, req.path);

  const token = req.cookies["auth-token"];

  if (!token) return res.status(401).json("No token provided");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);

    // here we create a user object and attach the username (email) to it
    req.user = { username: decoded.username };

    next();
  } catch (err) {
    console.error("Token verification failed", err.message);
    console.log(token);
    res.status(403).send("Invalid token");
  }
};

module.exports = authenticateJWT;
