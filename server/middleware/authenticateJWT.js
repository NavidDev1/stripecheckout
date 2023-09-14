const authenticateJWT = (req, res, next) => {
  const token = req.cookies["auth-token"];

  if (!token) return res.status(401).json("No token provided");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    req.username = decoded.username; // Passing email to the next middleware

    next();
  } catch (err) {
    console.log(token);
    res.status(408).send("Invalid token");
  }
};

module.exports = authenticateJWT;
