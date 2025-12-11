import ApiError from "../config/ApiError.js";
import ApiResponse from "../config/ApiResponse.js";
import asyncHandler from "../config/asyncHandler.js";
import Conversation from "../models/conversation.models.js";
import Message from "../models/message.models.js";
import { getRecieverIdSocket, io } from "../Socket/socket.js";

const sendMessage = asyncHandler(async (req, res) => {
  const { message } = req.body;
  const { id: receiverId } = req.params;
  const senderId = req.user._id;

  if (!message) {
    throw new ApiError(400, "Message text is required");
  }

  // check conversation exist
  let chats = await Conversation.findOne({
    participants: { $all: [senderId, receiverId] },
  });

  // create if not exist
  if (!chats) {
    chats = await Conversation.create({
      participants: [senderId, receiverId],
    });
  }

  // create message
  const newMessage = await Message.create({
    senderId,
    receiverId,
    message,
    conversationId: chats._id,
  });

  chats.messages.push(newMessage._id);
  await chats.save();

  // send realtime message
  const receiverSocketId = getRecieverIdSocket(receiverId);

  if (receiverSocketId) {
    io.to(receiverSocketId).emit("newMessage", newMessage);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, newMessage, "Message sent successfully"));
});


const recieveMessage = asyncHandler(async (req, res) => {
  const { id: receiverId } = req.params;
  const senderId = req.user._id;

  const chats = await Conversation.findOne({
    participants: { $all: [senderId, receiverId] },
  }).populate("messages");

  if (!chats) {
    return res.status(200).json(new ApiResponse(200, [], "No messages found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, chats.messages, "Messages fetched successfully"));
});


export {recieveMessage , sendMessage}