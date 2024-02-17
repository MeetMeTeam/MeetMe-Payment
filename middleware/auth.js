const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

const config = process.env;

const verifyToken = (req, res, next) => {
  //   console.log(req.headers.authorization);
  let token = req.headers.authorization;
  console.log(token);
  if (!token) {
    return res
      .status(403)
      .json({ message: "A token is required for authentication" });
  }
  try {
    token = token.replace(/^Bearer\s+/, "");
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).json({ message: "Invalid Token" });
  }

  return next();
};

module.exports = verifyToken;
