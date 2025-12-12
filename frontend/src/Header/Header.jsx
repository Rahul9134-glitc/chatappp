import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const Header = () => {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem("chatapp");
    setAuth(null);
    toast.success("Logout Successfully!");
    navigate("/login");
  };

  // 🔍 fetch search users
  const handleSearch = async (value) => {
    setQuery(value);

    if (value.trim() === "") {
      setResults([]);
      return;
    }

    try {
      const { data } = await axios.get(`/api/search?username=${value}`);
      setResults(data.users); // assuming → { users: [] }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full h-16 bg-white shadow-md flex items-center justify-between px-5 relative">

      {/* Logo */}
      <h1 className="text-2xl font-bold text-blue-600 tracking-wide">
        ChatAPP
      </h1>

      {/* Search Bar */}
      <div className="relative w-72">
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search user..."
          className="px-3 py-2 w-full rounded-lg border border-gray-300 focus:outline-blue-500 text-sm"
        />

        {/* search results dropdown */}
        {results.length > 0 && (
          <div className="absolute top-12 left-0 w-full bg-white shadow-lg rounded-md max-h-60 overflow-y-auto z-50 border border-gray-200">
            {results.map((user) => (
              <div
                key={user._id}
                className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-100 border-b"
              >
                <img
                  src={user.profilepic || "https://i.pravatar.cc/40"}
                  className="w-8 h-8 rounded-full object-cover border"
                />
                <p className="text-gray-700 text-sm">{user.username}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Profile + Logout */}
      <div className="flex items-center gap-4">
        <p className="text-gray-700 font-medium">
          {auth?.data?.username}
        </p>
        <img
          src={auth?.data?.profilepic || "https://i.pravatar.cc/50"}
          alt="profile"
          className="w-10 h-10 rounded-full object-cover border"
        />
        <button
          onClick={handleLogout}
          className="px-4 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 duration-200 text-sm"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Header;
