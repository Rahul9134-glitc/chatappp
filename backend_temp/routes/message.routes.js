import express from "express";
const router = express.Router();
import isLogin from "../middleware/isLogin.js";

import { sendMessage , recieveMessage } from "../controllers/message.controllers.js";


router.route("/send/:id").post(isLogin , sendMessage);
router.route("/:id").get(isLogin , recieveMessage);



export default router;