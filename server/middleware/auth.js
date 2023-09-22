const jwt = require("jsonwebtoken");
const jwtSecret = "your-secret-key";

function verifyJWT(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ error: "Token is not provided " });
  }

  try {
    jwt.verify(token, jwtSecret);
    next(); // if the token is verified, we proceed to the next middleware
  } catch (error) {
    res.status(401).json({ error: "invalid or expired token" });
  }
}

module.exports = verifyJWT;
