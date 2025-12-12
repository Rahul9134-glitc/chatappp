import ApiError from "../config/ApiError.js";
import asyncHandler from "../config/asyncHandler.js";
import ApiResponse from "../config/ApiResponse.js";
import User from "../models/user.models.js";
import bcrypt from "bcryptjs";
import jwtTokens from "../utils/jwtwebtoken.js";

const RegisterUser = asyncHandler(async (req, res) => {
  const { fullname, username, email, password, gender } = req.body;

  if (!fullname || !username || !email || !password || !gender) {
    throw new ApiError(400, "All fields are required");
  }

  const ExistUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (ExistUser) {
    throw new ApiError(409, "Username or Email already exists");
  }

  // Hash Password
  const hashPassword = await bcrypt.hash(password, 10);

  // Create new user
  const newUser = await User.create({
    fullname,
    username,
    password: hashPassword,
    email,
    gender,
  });

  jwtTokens(newUser._id, res);

  const userResponse = newUser.toObject();
  delete userResponse.password;

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { ...userResponse, tokens: req.cookies.jwt },
        "User Register Successfully"
      )
    );
});




const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found, please register first");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(400, "Invalid email or password");
  }

  jwtTokens(user._id, res);

  const userResponse = user.toObject();
  delete userResponse.password;

  return res
    .status(200)
    .json(new ApiResponse(200, userResponse, "User login successfully"));
});





const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    samesite: "strict",
    secure: process.env.NODE_ENV !== "development",
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Logout User Successfully"));
});

export { RegisterUser, loginUser, logoutUser };
