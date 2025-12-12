import React from "react";
import Sidebar from "../components/Sidebar";
import MessageContainer from "../components/MessageContainer";
import useConversation from "../zustand/useConversation";

const Home = () => {
  const { selectedConversation } = useConversation();

  return (
    <div className="w-full h-screen flex bg-[#F5F6F8] overflow-hidden">

      {/* 🟩 Sidebar */}
      <div
        className={`
          h-full bg-white border-r
          md:w-80 w-full
          md:block
          ${selectedConversation ? "hidden md:block" : "block"}
        `}
      >
        <Sidebar />
      </div>

      {/* 🟨 Message Container */}
      <div
        className={`
          flex-1 h-full
          ${!selectedConversation ? "hidden md:flex" : "flex"}
        `}
      >
        <MessageContainer />
      </div>

    </div>
  );
};

export default Home;
