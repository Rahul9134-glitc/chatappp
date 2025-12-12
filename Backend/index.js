import dotenv from "dotenv"
dotenv.config()
import connectMongo from "./db/db.js";
import AuthRouter from "./routes/auth.routes.js";
import MessageRouter from "./routes/message.routes.js";
import UserRouter from "./routes/user.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./Socket/socket.js"; 
import express from "express"
import path from "path";

const port = process.env.PORT;

const __dirname = path.resolve() 

// Connect DB
connectMongo();
app.use(
  cors({
    origin: "https://chatapp-8eh1.onrender.com",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());


app.use("/api/auth", AuthRouter);
app.use("/api/message", MessageRouter);
app.use("/api/user", UserRouter);

app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get(/.*/, (req, res) => { 
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  console.log("Dist file is making succesfully");
});

// ------------------------------------------------------------------
server.listen(port, () => {
  console.log("Server is Working on Port:", port);
});