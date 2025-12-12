import { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../context/AuthContext";


export default function Login() {
  const navigate = useNavigate();
  const {setAuth} = useAuth()
  const [input, setInput] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  const handleInput = (e) => {
    setInput({
      ...input,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("/api/auth/login", input);
      const data = response.data;

      if (data.success === false) {
        toast.error(data.message);
        setLoading(false);
        return;
      }
      setAuth(data)
      toast.success(data.message);
      localStorage.setItem("chatapp", JSON.stringify(data));
      
      setLoading(false);
      navigate("/"); 
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || "Login failed!");
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F6F8] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6">

        {/* Logo */}
        <div className="flex justify-center">
          <span className="text-3xl font-semibold text-orange-500">Login</span>
        </div>

        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Welcome back 👋
        </h2>
        <p className="text-center text-gray-500 text-sm">Login to continue access</p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          
          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <div className="flex items-center border rounded-xl px-3 py-2 bg-gray-50">
              <Mail size={18} className="text-gray-500" />
              <input
                id="email"
                type="email"
                placeholder="example@mail.com"
                className="w-full bg-transparent outline-none px-2 text-gray-700"
                value={input.email}
                onChange={handleInput}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <div className="flex items-center border rounded-xl px-3 py-2 bg-gray-50">
              <Lock size={18} className="text-gray-500" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full bg-transparent outline-none px-2 text-gray-700"
                value={input.password}
                onChange={handleInput}
                required
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

          {/* Button */}
          <button
            disabled={loading}
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 transition text-white py-3 rounded-xl font-medium shadow-md disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600">
          Don’t have an account?{" "}
          <Link to="/register" className="text-orange-500 font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
