import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signup(form.name, form.email, form.password);
      navigate("/login"); // redirect to login after signup
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
        <h2 className="text-3xl font-bold text-center mb-8">
          Create Your Account
        </h2>

        {/* Error Message */}
        {error && (
          <p className="mb-4 text-red-400 bg-red-400/10 p-2 rounded-lg border border-red-400/20 text-center">
            {error}
          </p>
        )}

        {/* Form */}
        <form onSubmit={handleSignup} className="space-y-6">
          {/* Name */}
          <div className="flex flex-col text-left">
            <label className="text-sm mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
              className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 
              placeholder-gray-300 outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>

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
          <div className="flex flex-col text-left">
            <label className="text-sm mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="Create a strong password"
              className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 
              placeholder-gray-300 outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>

          {/* Signup Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-200 to-purple-100 
            text-black font-semibold text-lg shadow-lg hover:scale-105 transition duration-300 
            disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-300 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-purple-300 hover:underline font-semibold"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
