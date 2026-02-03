const jwt = require("jsonwebtoken");

// Token blacklist to store invalidated tokens
const tokenBlacklist = new Set();

exports.authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    // Check if token is blacklisted
    if (tokenBlacklist.has(token)){
      return res.status(401).json({ message: "Token has been invalidated" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user id to request
    req.user = { id: decoded.id };
    next();

  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Export tokenBlacklist for use in other modules
exports.tokenBlacklist = tokenBlacklist;