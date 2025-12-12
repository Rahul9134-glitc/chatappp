import express from "express";

const router = express.Router();
import {
  RegisterUser,
  loginUser,
  logoutUser,
} from "../controllers/auth.controllers.js";

router.route("/register").post(RegisterUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);

export default router;
