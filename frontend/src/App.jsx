import React from "react";
import Login from "./Login/Login";
import Register from "./Register/Register";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./Home/Home";
import { VerifyUser } from "./utils/VerifyUsers";

const App = () => {
  return (
    <div className="min-h-screen w-full bg-[#F5F6F8] flex items-center justify-center">

      <ToastContainer position="top-right" autoClose={2000} />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<VerifyUser/>}>
          <Route path="/" element={<Home />} />     
        </Route>
      </Routes>

    </div>
  );
};

export default App;
