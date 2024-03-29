const jwt = require("jsonwebtoken");
const AppError = require("../Helpers/AppError");
const User = require("../Models/Users");
require("dotenv").config();

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) return next(new AppError("please provide a token"));
    // const id = jwt.verify(token, "mytoken").id;
    const secretKey = process.env.JWT_SECRET; // Load the secret key from environment variable
    const id = jwt.verify(token, secretKey).id;

    req.authorizedUser = await User.findById(id);
    req.user = req.authorizedUser;
    if (!req.authorizedUser)
      return next(new AppError("user is not found or invalid token:/"));
    req.id = id;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = verifyToken;
