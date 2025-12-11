import React, { useEffect, useRef, useState } from "react";
import useConversation from "../zustand/useConversation";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { ArrowLeft, Loader2 } from "lucide-react";
import { UseSocketContext } from "../context/SocketIOContext";
import notify from "../../src/assets/sound/mixkit-long-pop-2358.wav";

const MessageContainer = () => {
  const {
    selectedConversation,
    setSelectedConversation,
    messages,
    setMessages,
  } = useConversation();

  const { auth } = useAuth();
  const { socket } = UseSocketContext();

  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendData, setSendData] = useState("");

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!socket) return;
    const handler = (newMessage) => {
      const sound = new Audio(notify);
      sound.play();
      setMessages((prev) => [...prev, newMessage]); // FIXED ✔
    };

    socket.on("newMessage", handler);

    return () => socket.off("newMessage", handler);
  }, [socket, setMessages]);

  // FETCH MESSAGES WHEN SELECTED USER CHANGES
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (!selectedConversation?._id) return;

        setLoading(true);

        const res = await axios.get(`/api/message/${selectedConversation._id}`);

        setMessages(res.data?.data || []);
        setLoading(false);

        scrollToBottom();
      } catch (err) {
        console.log("Message Fetch Error:", err);
        setLoading(false);
      }
    };

    fetchMessages();
  }, [selectedConversation?._id]);

  // AUTO SCROLL WHEN MESSAGES CHANGE
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // DATE HELPERS
  const formatDayKey = (iso) => {
    const d = new Date(iso);
    return d.toISOString().split("T")[0];
  };

  const dayLabel = (iso) => {
    const d = new Date(iso);
    const today = new Date();
    const yesterday = new Date(Date.now() - 86400000);

    const sameDay = (a, b) =>
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate();

    if (sameDay(d, today)) return "Today";
    if (sameDay(d, yesterday)) return "Yesterday";

    return d.toLocaleDateString([], {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const shortTime = (iso) =>
    new Date(iso).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  // SEND MESSAGE
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!sendData.trim()) return;

    setSending(true);

    try {
      const res = await axios.post(
        `/api/message/send/${selectedConversation._id}`,
        { message: sendData }
      );

      const newMsg = res.data?.data;

      if (newMsg) {
        setMessages([...messages, newMsg]);
        setSendData("");
        scrollToBottom();
      }
    } catch (error) {
      console.log("Send Error:", error);
    } finally {
      setSending(false);
    }
  };

  // NOTHING SELECTED VIEW
  if (!selectedConversation) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full text-center px-6 bg-white">
        <h1 className="text-2xl font-semibold text-gray-700">
          Welcome {auth?.data?.username} 👋
        </h1>
        <p className="text-gray-500 mt-3">
          Choose someone from the sidebar to start chatting.
        </p>
      </div>
    );
  }

  let lastDayKey = null;

  return (
    <div className="flex flex-col w-full h-screen bg-white">
      {/* HEADER */}
      <div className="p-4 border-b bg-gray-100 flex items-center gap-3">
        <button
          onClick={() => setSelectedConversation(null)}
          className="block md:hidden p-2 hover:bg-gray-200 rounded-lg"
        >
          <ArrowLeft size={20} />
        </button>

        <img
          src={selectedConversation.profilepic}
          className="w-10 h-10 rounded-full border"
          alt="profile"
        />

        <h2 className="text-lg font-semibold">
          {selectedConversation.username}
        </h2>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 p-4 overflow-y-auto bg-[#f9fafb]">
        {loading ? (
          <p className="text-center text-gray-500">Loading messages...</p>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            <p>No messages yet 👋</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === auth?.data?._id;

            const dayKey = formatDayKey(msg.createdAt);
            const showDaySeparator = dayKey !== lastDayKey;
            lastDayKey = dayKey;

            return (
              <React.Fragment key={msg._id}>
                {/* DATE SEPARATOR */}
                {showDaySeparator && (
                  <div className="w-full flex justify-center my-4">
                    <span className="text-xs text-gray-500 px-3 py-1 bg-gray-100 rounded-full">
                      {dayLabel(msg.createdAt)}
                    </span>
                  </div>
                )}

                {/* MESSAGE ROW */}
                <div
                  className={`flex my-3 ${
                    isMe ? "justify-end" : "justify-start"
                  }`}
                >
                  {/* LEFT AVATAR FOR RECEIVED MESSAGE */}
                  {!isMe && (
                    <img
                      src={selectedConversation.profilepic}
                      alt={selectedConversation.username}
                      className="w-7 h-7 rounded-full mr-2 self-end"
                    />
                  )}

                  <div className="flex flex-col max-w-[75%] break-words">
                    <div
                      className={`px-4 py-2 rounded-xl text-sm ${
                        isMe
                          ? "bg-orange-500 text-white rounded-br-none self-end"
                          : "bg-gray-200 text-gray-900 rounded-bl-none self-start"
                      }`}
                    >
                      {msg.message}
                    </div>

                    <span
                      className={`mt-1 text-[10px] ${
                        isMe
                          ? "text-right text-gray-600"
                          : "text-left text-gray-500"
                      }`}
                    >
                      {shortTime(msg.createdAt)}
                    </span>
                  </div>

                  {/* RIGHT AVATAR FOR SENT MESSAGE */}
                  {isMe && (
                    <img
                      src={auth?.data?.profilepic}
                      alt={auth?.data?.username}
                      className="w-7 h-7 rounded-full ml-2 self-end"
                    />
                  )}
                </div>
              </React.Fragment>
            );
          })
        )}

        <div ref={messagesEndRef}></div>
      </div>

      {/* INPUT */}
      <form
        onSubmit={handleSubmit}
        className="p-4 border-t bg-white flex items-center gap-2"
      >
        <input
          value={sendData}
          onChange={(e) => setSendData(e.target.value)}
          type="text"
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border rounded-lg outline-none"
        />

        <button
          type="submit"
          disabled={sending}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-60 flex items-center"
        >
          {sending ? <Loader2 className="animate-spin" size={18} /> : "Send"}
        </button>
      </form>
    </div>
  );
};

export default MessageContainer;
