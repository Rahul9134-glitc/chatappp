import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Search, ArrowLeft, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import useConversation from "../zustand/useConversation";
import { UseSocketContext } from "../context/SocketIOContext";
import notify from "../../src/assets/sound/notification.mp3";

const Sidebar = () => {
  const [searchInput, setSearchInput] = useState("");
  const [Loading, setLoading] = useState(false);
  const [searchUser, setSearchUser] = useState([]);
  const [currentUser, setCurrentUser] = useState([]);

  const { selectedConversation, setSelectedConversation } = useConversation();
  const { auth, setAuth } = useAuth();
  const { online, socket } = UseSocketContext();

  const [unread, setUnread] = useState({});

  useEffect(() => {
    if (!socket) return;

    const handler = (msg) => {
      const sound = new Audio(notify);
      sound.play().catch(() => {});

      if (selectedConversation?._id === msg.senderId) return;

      setUnread((prev) => ({
        ...prev,
        [msg.senderId]: (prev[msg.senderId] || 0) + 1,
      }));
    };

    socket.on("newMessage", handler);
    return () => socket.off("newMessage", handler);
  }, [socket, selectedConversation]);

  useEffect(() => {
    const chatUser = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/user/currentchatters`);
        const data = res.data;

        if (!data.success) {
          toast.error(data.message);
          return;
        }
        setCurrentUser(data.data);
      } catch (error) {
        toast.error("Failed to load chat users");
      } finally {
        setLoading(false);
      }
    };
    chatUser();
  }, []);

  const handleUserClick = (user) => {
    setSelectedConversation(user);

    setUnread((prev) => ({
      ...prev,
      [user._id]: 0,
    }));

    if (window.innerWidth < 768) {
      document.body.scrollTop = 0;
    }
  };

  const handleBackClick = () => {
    setSearchInput("");
    setSearchUser([]);
    setSelectedConversation(null); // ⭐ BACK TO RECENT CHAT LIST
  };

  const handleLogout = async () => {
    try {
      await axios.get("/api/auth/logout");
      setAuth(null);
      toast.success("Logout successfully");
      window.location.reload();
    } catch {
      toast.error("Logout failed");
    }
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!searchInput) {
      toast.info("Enter username or email!");
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.get(`/api/user/search?search=${searchInput}`);

      if (!data.success) {
        toast.error(data.message);
        setSearchUser([]);
        return;
      }
      setSearchUser(data.data);
    } catch {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const isOnline = (id) => online.includes(id);

  return (
    <div
      className={`w-full md:w-80 h-screen bg-white border-r shadow-sm flex flex-col 
      transition-transform duration-300 
      ${selectedConversation ? "-translate-x-full md:translate-x-0" : "translate-x-0"}`}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-white sticky top-0 z-20">
        <button onClick={handleBackClick} className="p-2 hover:bg-gray-200 rounded-lg">
          <ArrowLeft size={18} />
        </button>

        <h2 className="text-lg font-semibold text-gray-700">Chats</h2>

        <button
          onClick={handleLogout}
          className="p-2 hover:bg-red-100 rounded-lg text-red-500"
        >
          <LogOut size={18} />
        </button>
      </div>

      {/* LOGGED USER INFO */}
      {auth && (
        <div className="flex items-center gap-3 p-4 border-b bg-gray-50">
          <img
            src={auth.data.profilepic}
            className="w-12 h-12 rounded-full border"
          />

          <div>
            <p className="font-semibold text-gray-700">{auth.username}</p>
            <p className="text-xs text-gray-500">{auth.email}</p>
            <span className="text-[10px] px-2 py-1 bg-orange-100 text-orange-600 rounded-full">
              You
            </span>
          </div>
        </div>
      )}

      {/* SEARCH */}
      <form
        onSubmit={handleSearchSubmit}
        className="flex items-center gap-2 px-4 py-2 border-b"
      >
        <input
          type="text"
          value={searchInput}
          placeholder="Search user..."
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-gray-100 border text-sm"
        />
        <button
          type="submit"
          className="p-2 bg-orange-500 hover:bg-orange-600 rounded-lg text-white"
        >
          <Search size={18} />
        </button>
      </form>

      {/* USER LIST */}
      <div className="overflow-y-auto mt-2 max-h-[calc(100vh-200px)] px-3">

        {searchUser.length === 0 && currentUser.length > 0 && (
          <>
            <h2 className="mb-2 text-gray-600 text-sm font-semibold mt-2">
              Recent Chats
            </h2>

            {currentUser.map((user) => (
              <div
                key={user._id}
                onClick={() => handleUserClick(user)}
                className={`flex items-center gap-3 p-2 border-b cursor-pointer 
                hover:bg-gray-100 transition-all duration-200 transform hover:scale-[1.02]
                ${selectedConversation?._id === user._id ? "bg-gray-200" : ""}`}
              >
                <div className="relative">
                  <img
                    src={user.profilepic}
                    className="w-10 h-10 rounded-full border"
                  />

                  {/* ONLINE DOT WITH ANIMATION */}
                  {isOnline(user._id) && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border border-white online-pulse"></span>
                  )}

                  {unread[user._id] > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 text-white text-[10px] rounded-full flex items-center justify-center">
                      {unread[user._id]}
                    </span>
                  )}
                </div>

                <div>
                  <p className="font-medium text-gray-700">{user.username}</p>
                  <p className="text-sm text-gray-500">{user.fullname}</p>
                </div>
              </div>
            ))}
          </>
        )}

        {!Loading && searchUser.length > 0 && (
          <>
            <h2 className="mb-2 text-gray-600 text-sm font-semibold mt-2">
              Search Results
            </h2>

            {searchUser.map((user) => (
              <div
                key={user._id}
                onClick={() => handleUserClick(user)}
                className={`flex items-center gap-3 p-2 border-b cursor-pointer 
                hover:bg-gray-100 transition-all duration-200 transform hover:scale-[1.02]
                ${selectedConversation?._id === user._id ? "bg-gray-200" : ""}`}
              >
                <img src={user.profilepic} className="w-10 h-10 rounded-full border" />

                <div>
                  <p className="font-medium text-gray-700">{user.username}</p>
                  <p className="text-sm text-gray-500">{user.gender}</p>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
