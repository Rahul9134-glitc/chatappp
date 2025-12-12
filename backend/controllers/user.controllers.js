import ApiError from "../config/ApiError.js";
import ApiResponse from "../config/ApiResponse.js";
import asyncHandler from "../config/asyncHandler.js";
import Conversation from "../models/conversation.models.js";
import User from "../models/user.models.js";

const searchUser = asyncHandler(async (req, res) => {
  const search = req.query.search || "";
  const currentUser = req.user._id;

  const user = await User.find({
    $and: [
      {
        $or: [
          { username: { $regex: search, $options: "i" } },
          { fullname: { $regex: search, $options: "i" } },
        ],
      },
      {
        _id: { $ne: currentUser },
      },
    ],
  }).select("-password");

  return res.status(200).json(
    new ApiResponse(200, user, "User fetch Successfully")
  );
});



const getCurrentChatters = asyncHandler(async (req, res) => {
  const currentUserId = req.user._id;

  const currentChatters = await Conversation.find({
    participants: currentUserId
  })
    .sort({ updatedAt: -1 })
    .populate("participants", "-password -email");

  if (!currentChatters || currentChatters.length === 0) {
    return res.status(200).json(
      new ApiResponse(200, [], "No chat history found")
    );
  }

  const users = currentChatters.map(chat =>
    chat.participants.find(
      user => user._id.toString() !== currentUserId.toString()
    )
  );

  const uniqueUsers = users.filter(
    (user, index, arr) =>
      user && index === arr.findIndex(u => u._id.toString() === user._id.toString())
  );

  return res.status(200).json(
    new ApiResponse(200, uniqueUsers, "Chat partners fetched successfully")
  );
});



export {searchUser , getCurrentChatters}
