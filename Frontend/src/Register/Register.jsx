import { useState } from "react";
import { Mail, Lock, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [Input, setInput] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    gender: "",
  });
  const {setAuth} = useAuth()

  const [Loader, setLoader] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleInput = (e) => {
    setInput({ ...Input, [e.target.name]: e.target.value });
  };

  const selectedGender = (selectGender) => {
    setInput((prev) => ({
      ...prev,
      gender: prev.gender === selectGender ? "" : selectGender,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);

    if (!Input.fullname || !Input.username || !Input.email || !Input.password || !Input.gender) {
      toast.error("All fields are required!");
      setLoader(false);
      return;
    }

    try {
      const res = await axios.post("/api/auth/register", Input);
      const data = res.data;

      if (data.success === false) {
        toast.error(data.message);
        setLoader(false);
        return;
      }

      setAuth(data);

      toast.success("Account Created Successfully!");

      localStorage.setItem("chatapp", JSON.stringify(data));

      setTimeout(() => {
        navigate("/login");
      }, 1200);

      setLoader(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Server Error");
      setLoader(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F6F8] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6">

        <div className="flex justify-center">
          <span className="text-3xl font-semibold text-orange-500">S</span>
        </div>

        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Create Account 🚀
        </h2>
        <p className="text-center text-gray-500 text-sm">
          Sign up to get started
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>

          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Full Name</label>
            <div className="flex items-center border rounded-xl px-3 py-2 bg-gray-50">
              <User size={18} className="text-gray-500" />
              <input
                type="text"
                name="fullname"
                placeholder="John Doe"
                onChange={handleInput}
                className="w-full bg-transparent outline-none px-2 text-gray-700"
              />
            </div>
          </div>

          {/* Username */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Username</label>
            <div className="flex items-center border rounded-xl px-3 py-2 bg-gray-50">
              <User size={18} className="text-gray-500" />
              <input
                type="text"
                name="username"
                placeholder="johndoe"
                onChange={handleInput}
                className="w-full bg-transparent outline-none px-2 text-gray-700"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <div className="flex items-center border rounded-xl px-3 py-2 bg-gray-50">
              <Mail size={18} className="text-gray-500" />
              <input
                type="email"
                name="email"
                placeholder="example@mail.com"
                onChange={handleInput}
                className="w-full bg-transparent outline-none px-2 text-gray-700"
              />
            </div>
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Gender</label>
            <div className="flex gap-3">
              {["Male", "Female", "Others"].map((g) => (
                <button
                  type="button"
                  key={g}
                  onClick={() => selectedGender(g)}
                  className={`px-4 py-2 rounded-xl text-sm border 
                    ${Input.gender === g
                      ? "bg-orange-500 text-white border-orange-500"
                      : "bg-gray-50 text-gray-700 border-gray-300"}
                  `}
                >
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <div className="flex items-center border rounded-xl px-3 py-2 bg-gray-50">
              <Lock size={18} className="text-gray-500" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                onChange={handleInput}
                className="w-full bg-transparent outline-none px-2 text-gray-700"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Signup */}
          <button
            type="submit"
            disabled={Loader}
            className="w-full bg-orange-500 hover:bg-orange-600 transition text-white py-3 rounded-xl font-medium shadow-md"
          >
            {Loader ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-orange-500 font-medium hover:underline">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}
