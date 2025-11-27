import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative z-10">
      <div className="w-full max-w-md backdrop-blur-xl bg-white/10 border border-white/20 p-8 rounded-2xl shadow-2xl text-white">
        {/* Heading */}
        <h2 className="text-3xl font-bold text-center mb-8">Welcome Back</h2>

        {/* Error Message */}
        {error && (
          <p className="mb-4 text-red-400 bg-red-400/10 p-2 rounded-lg border border-red-400/20 text-center">
            {error}
          </p>
        )}

        {/* Login Form */}
        <form className="space-y-6" onSubmit={handleLogin}>
          {/* Email */}
          <div className="flex flex-col text-left">
            <label className="text-sm mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 
              placeholder-gray-300 outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col text-left relative">
            <label className="text-sm mb-1">Password</label>

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 
              placeholder-gray-300 outline-none focus:ring-2 focus:ring-purple-300"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-10 text-gray-300 hover:text-white"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-200 to-purple-100 
            text-black font-semibold text-lg shadow-lg hover:scale-105 transition duration-300 
            disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-300 mt-6">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-purple-300 hover:underline font-semibold"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
