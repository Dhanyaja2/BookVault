import React from "react";
import { Lock, Search } from "lucide-react";
import StartExploringButton from "./StartExploringButton";
import { useNavigate } from "react-router-dom";

const MainContent = () => {
  const alert = () => {
    window.alert("Login to use the search feature!");
  };

  const navigate = useNavigate();

  return (
    <div className="relative z-10 text-center pt-28 pb-20">
      {/* Radial Glow */}
      <div className="absolute inset-0 flex justify-center pointer-events-none">
        <div className="w-[900px] h-[500px] bg-purple-300/20 blur-[160px] rounded-full"></div>
      </div>

      <h1 className="text-5xl font-bold leading-tight mb-6">
        Discover, Organize, and Track <br /> Your Books
      </h1>

      <p className="text-lg text-gray-800 mb-10 opacity-90">
        Find your next favorite read and save it to your library instantly
      </p>

      {/* Glass Search Bar (Disabled) */}
      <div className="backdrop-blur-xl bg-white/20 w-[650px] mx-auto h-[70px] rounded-full flex items-center px-6 shadow-xl border border-white/20">
        <button className="text-gray-300 mr-3" onClick={alert}>
          <Search />
        </button>
        <button onClick={alert}>
          <input
            placeholder="Login to search for books..."
            className="bg-transparent text-gray-300 placeholder-gray-400 w-full outline-none"
          />
        </button>
      </div>

      {/* CTA */}
      <button
        onClick={() => navigate("/login")}
        className="mt-8 px-8 py-5 rounded-full bg-[#aca8a8]
              hover:bg-[#aaa8a8] text-lg inter cursor-pointer shadow-lg hover:scale-105 transition duration-300 outline-0 text-black font-bold"
      >
        Start Exploring
      </button>
    </div>
  );
};

export default MainContent;
