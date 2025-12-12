import express from "express";
const router = express.Router();


import { searchUser , getCurrentChatters } from "../controllers/user.controllers.js";
import isLogin from "../middleware/isLogin.js";


router.route("/search").get(isLogin , searchUser);
router.route("/currentchatters").get(isLogin , getCurrentChatters);


export default router;