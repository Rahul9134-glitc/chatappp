import jwt from "jsonwebtoken";
import User from "../models/user.models.js";
import ApiError from "../config/ApiError.js";
import asyncHandler from "../config/asyncHandler.js";

const isLogin = asyncHandler(async (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    throw new ApiError(401, "Unauthorized, No token provided");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new ApiError(401, "Invalid or expired token, please login again");
  }

  const user = await User.findById(decoded.userId).select("-password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  req.user = user;
  next();
});


export default isLogin;
