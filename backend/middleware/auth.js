const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ success: false, error: "Token not found" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res
      .status(403)
      .json({ success: false, error: "Token invalid or expired" });
  }
}

module.exports = authenticateToken;
