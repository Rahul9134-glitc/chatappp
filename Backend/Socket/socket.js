import { Server } from "socket.io";
import http from "http";
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
  },
});

// Map USER_ID → SOCKET_ID
const userSocketMap = {};

export const getRecieverIdSocket = (receiverId) => {
  return userSocketMap[receiverId];
};

io.on("connection", (socket) => {
  console.log("New User Connected:", socket.id);

  const userId = socket.handshake.query.userId;

  if (userId && userId !== "undefined") {
    userSocketMap[userId] = socket.id;

    console.log("User Registered:", userId, "Socket:", socket.id);
  }

  // send online users
  io.emit("getOnlineUser", Object.keys(userSocketMap));

  // FIX: Use socket.on, not io.on
  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);

    if (userId) {
      delete userSocketMap[userId];
    }

    io.emit("getOnlineUser", Object.keys(userSocketMap));
  });
});

export { io, server, app };
