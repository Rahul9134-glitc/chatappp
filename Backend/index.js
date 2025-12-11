import dotenv from "dotenv";
dotenv.config();
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

// Middlewares
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Base route
app.get("/", (req, res) => {
  res.send("Hello World Server is running");
});

// API routes
app.use("/api/auth", AuthRouter);
app.use("/api/message", MessageRouter);
app.use("/api/user", UserRouter);

app.use(express.static(path.join(__dirname,"/Frontend/dist")));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "Frontend", "dist", "index.html"));
});

// Start server
server.listen(port, () => {
  console.log("Server is Working on Port:", port);
});
