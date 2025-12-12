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

// path.resolve() को यहां रहने दें
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

// Base route को हटा दें या कमेंट कर दें (DELETE OR COMMENT THIS BLOCK)
// app.get("/", (req, res) => {
//   res.send("Hello World Server is running"); 
// });

// API routes - इन्हें फ्रंटएंड राउट्स से ऊपर रहना चाहिए 
app.use("/api/auth", AuthRouter);
app.use("/api/message", MessageRouter);
app.use("/api/user", UserRouter);

// ------------------------------------------------------------------
// PRODUCTION-READY FRONTEND SERVING LOGIC
// ------------------------------------------------------------------

// 1. Static Files को सर्व करें 
app.use(express.static(path.join(__dirname, "Frontend", "dist")));

// 2. सभी बाकी राउट्स (जैसे '/', '/chat', '/login') को index.html भेजें
// यह राउट्स को हैंडल करने वाला अंतिम राउट होना चाहिए
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "Frontend", "dist", "index.html"));
});

// ------------------------------------------------------------------

// Start server
server.listen(port, () => {
  console.log("Server is Working on Port:", port);
});